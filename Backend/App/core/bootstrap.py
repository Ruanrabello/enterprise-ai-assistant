from sqlalchemy.orm import Session
from core.constants import CURRENT_USER_ID, DEFAULT_USER_EMAIL, DEFAULT_USER_NAME
from database.models.Usuario import Usuario


def ensure_default_user(db: Session) -> Usuario:
  usuario = db.query(Usuario).filter(Usuario.id == CURRENT_USER_ID).first()

  if usuario:
    return usuario

  usuario = Usuario(
    id=CURRENT_USER_ID,
    nome=DEFAULT_USER_NAME,
    email=DEFAULT_USER_EMAIL,
  )

  db.add(usuario)
  db.commit()
  db.refresh(usuario)

  return usuario
