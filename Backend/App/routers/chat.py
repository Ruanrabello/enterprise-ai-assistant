from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.auth import get_current_user
from database.database import get_db
from database.models.Usuario import Usuario
from schemas.conversa import (
  ConversaCreate,
  ConversaResponse,
  MensagemRequest,
  MensagensResponse,
  NovaMensagemResponse,
)
from services.chatservice import criar_conversa, criar_mensagem, listar_conversas, listar_mensagens

router = APIRouter(
  prefix="/chat",
  tags=["Chat"],
)


@router.get("/conversas", response_model=List[ConversaResponse])
def listar_conversas_endpoint(
  db: Session = Depends(get_db),
  usuario: Usuario = Depends(get_current_user),
):
  return listar_conversas(db, usuario_id=usuario.id)


@router.post("/conversas", response_model=ConversaResponse)
def nova_conversa(
  conversa: ConversaCreate,
  db: Session = Depends(get_db),
  usuario: Usuario = Depends(get_current_user),
):
  return criar_conversa(
    db=db,
    titulo=conversa.titulo,
    usuario_id=usuario.id,
  )


@router.get("/{id}/mensagens", response_model=List[MensagensResponse])
def listar_mensagens_endpoint(
  id: int,
  db: Session = Depends(get_db),
  usuario: Usuario = Depends(get_current_user),
):
  return listar_mensagens(db, id, usuario.id)


@router.post("/{id}/mensagens", response_model=NovaMensagemResponse)
def nova_mensagem(
  id: int,
  request: MensagemRequest,
  db: Session = Depends(get_db),
  usuario: Usuario = Depends(get_current_user),
):
  return criar_mensagem(
    db=db,
    conversa_id=id,
    usuario=request.usuario,
    texto=request.texto,
    usuario_id=usuario.id,
    pesquisa_web=request.pesquisa_web,
  )
