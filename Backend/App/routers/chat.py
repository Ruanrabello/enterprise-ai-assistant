from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from core.constants import CURRENT_USER_ID
from database.database import get_db
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
def listar_conversas_endpoint(db: Session = Depends(get_db)):
  return listar_conversas(db, usuario_id=CURRENT_USER_ID)


@router.post("/conversas", response_model=ConversaResponse)
def nova_conversa(
  conversa: ConversaCreate,
  db: Session = Depends(get_db),
):
  return criar_conversa(
    db=db,
    titulo=conversa.titulo,
    usuario_id=CURRENT_USER_ID,
  )


@router.get("/{id}/mensagens", response_model=List[MensagensResponse])
def listar_mensagens_endpoint(id: int, db: Session = Depends(get_db)):
  return listar_mensagens(db, id)


@router.post("/{id}/mensagens", response_model=NovaMensagemResponse)
def nova_mensagem( id: int, request: MensagemRequest, db: Session = Depends(get_db),):
  return criar_mensagem(
    db=db,
    conversa_id=id,
    usuario=request.usuario,
    texto=request.texto,
    pesquisa_web=request.pesquisa_web,
  )
