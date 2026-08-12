from dataclasses import dataclass
from typing import Annotated, Any

import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from config import SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL
from database.database import get_db
from database.models.Usuario import Usuario

bearer_scheme = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class SupabaseIdentity:
  id: str
  email: str
  name: str


def _unauthorized(detail: str = "Sessão inválida ou expirada.") -> HTTPException:
  return HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail=detail,
    headers={"WWW-Authenticate": "Bearer"},
  )


async def _validate_supabase_token(token: str) -> SupabaseIdentity:
  if not SUPABASE_URL or not SUPABASE_PUBLISHABLE_KEY:
    raise HTTPException(
      status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
      detail="A autenticação do servidor ainda não foi configurada.",
    )

  endpoint = f"{SUPABASE_URL.rstrip('/')}/auth/v1/user"

  try:
    async with httpx.AsyncClient(timeout=10.0) as client:
      response = await client.get(
        endpoint,
        headers={
          "apikey": SUPABASE_PUBLISHABLE_KEY,
          "Authorization": f"Bearer {token}",
        },
      )
  except httpx.RequestError as error:
    raise HTTPException(
      status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
      detail="Não foi possível validar a sessão no Supabase.",
    ) from error

  if response.status_code != status.HTTP_200_OK:
    raise _unauthorized()

  try:
    payload: dict[str, Any] = response.json()
  except ValueError as error:
    raise _unauthorized() from error

  supabase_id = payload.get("id")
  email = payload.get("email")
  metadata = payload.get("user_metadata") or {}

  if not isinstance(supabase_id, str) or not isinstance(email, str):
    raise _unauthorized()

  metadata_name = metadata.get("nome") if isinstance(metadata, dict) else None
  name = metadata_name.strip() if isinstance(metadata_name, str) else ""

  return SupabaseIdentity(
    id=supabase_id,
    email=email.strip().lower(),
    name=name or email.split("@", maxsplit=1)[0],
  )


def _find_or_create_local_user(db: Session, identity: SupabaseIdentity) -> Usuario:
  user = db.query(Usuario).filter(Usuario.supabase_id == identity.id).first()

  if user:
    if user.email != identity.email:
      email_owner = db.query(Usuario).filter(Usuario.email == identity.email).first()

      if email_owner and email_owner.id != user.id:
        raise HTTPException(
          status_code=status.HTTP_409_CONFLICT,
          detail="Este e-mail já está associado a outro perfil local.",
        )

      user.email = identity.email
      db.commit()
      db.refresh(user)

    return user

  user = db.query(Usuario).filter(Usuario.email == identity.email).first()

  if user:
    user.supabase_id = identity.id
  else:
    user = Usuario(
      nome=identity.name,
      email=identity.email,
      supabase_id=identity.id,
    )
    db.add(user)

  try:
    db.commit()
    db.refresh(user)
  except IntegrityError as error:
    db.rollback()
    raise HTTPException(
      status_code=status.HTTP_409_CONFLICT,
      detail="Não foi possível associar a conta ao perfil local.",
    ) from error

  return user


async def get_current_user(
  credentials: Annotated[
    HTTPAuthorizationCredentials | None,
    Depends(bearer_scheme),
  ],
  db: Annotated[Session, Depends(get_db)],
) -> Usuario:
  if not credentials or credentials.scheme.lower() != "bearer":
    raise _unauthorized("Faça login para acessar este recurso.")

  identity = await _validate_supabase_token(credentials.credentials)
  return _find_or_create_local_user(db, identity)
