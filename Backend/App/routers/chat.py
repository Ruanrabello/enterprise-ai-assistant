from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database.database import get_db
from schemas.conversa import ConversaCreate, ConversaResponse, MensagensResponse, MensagemRequest
from services.chatservice import criar_conversa, listar_conversas, listar_mensagens, criar_mensagem

from typing import List



router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)
# -----------------------------------------------------------------

@router.get("/conversas", response_model=List[ConversaResponse])
def listar_conversas_endpoint(db: Session = Depends(get_db)):
    return listar_conversas(db,usuario_id= 1)



@router.post( "/conversas", response_model=ConversaResponse)
def nova_conversa(
    conversa: ConversaCreate,
    db: Session = Depends(get_db)
):
    return criar_conversa(
        db=db,
        titulo=conversa.titulo,
        usuario_id=1                     #Porque ainda não temos login. mais pra frente mudara usuario_id = usuario_logado.id
    )

# ------------------------------------------------------------------------

@router.get("/{id}/mensagens", response_model=List[MensagensResponse])
def listar_mensagens_endpoint(id: int, db:Session = Depends(get_db)):
    return listar_mensagens(db, id)


@router.post("/{id}/mensagens", response_model=MensagensResponse)
def nova_mensagem (
    id: int,
    request: MensagemRequest,
    db: Session = Depends(get_db)
):
    return criar_mensagem(
        db = db,
        conversa_id=id,
        usuario=request.usuario,
        texto=request.texto
    )
