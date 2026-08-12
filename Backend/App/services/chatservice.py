from fastapi import HTTPException
from sqlalchemy.orm import Session

from database.models.Conversa import Conversa
from database.models.Mensagem import Mensagem
from database.models.configuracao_ia import ConfiguracaoIA
from services.ia_service import gerar_resposta_ia, gerar_titulo_conversa
from services.web_search_service import WebSearchMode


def criar_conversa(
    db: Session,
    titulo: str,
    usuario_id: int,
):

  conversa = Conversa(
    titulo=titulo.strip(),
    usuario_id=usuario_id,
  )

  db.add(conversa)
  db.commit()
  db.refresh(conversa)

  return conversa


def listar_conversas(db: Session, usuario_id: int):

  return (
    db.query(Conversa)
    .filter(Conversa.usuario_id == usuario_id)
    .order_by(Conversa.created_at.desc(), Conversa.id.desc())
    .all()
  )


def listar_mensagens(db: Session, conversa_id: int, usuario_id: int):
  conversa = db.query(Conversa).filter(
    Conversa.id == conversa_id,
    Conversa.usuario_id == usuario_id,
  ).first()

  if not conversa:
    raise HTTPException(status_code=404, detail="Conversa não encontrada.")

  return (
    db.query(Mensagem)
    .filter(Mensagem.conversa_id == conversa_id)
    .order_by(Mensagem.created_at.asc(), Mensagem.id.asc())
    .all()
  )


def criar_mensagem(
  db: Session,
  conversa_id: int,
  usuario: str,
  texto: str,
  usuario_id: int,
  pesquisa_web: WebSearchMode = "auto",
):
  conversa = db.query(Conversa).filter(
    Conversa.id == conversa_id,
    Conversa.usuario_id == usuario_id,
  ).first()

  if not conversa:
    raise HTTPException(status_code=404, detail="Conversa não encontrada.")

  primeira_mensagem = (
    db.query(Mensagem)
    .filter(Mensagem.conversa_id == conversa.id)
    .count() == 0
  )

  mensagem_usuario = Mensagem(
    conversa_id=conversa_id,
    usuario=usuario,
    texto=texto.strip(),
  )

  db.add(mensagem_usuario)
  db.commit()
  db.refresh(mensagem_usuario)

  configuracao = db.query(ConfiguracaoIA).filter(
    ConfiguracaoIA.usuario_id == usuario_id
  ).first()

  if not configuracao:
    raise HTTPException(
      status_code=400,
      detail="Nenhuma configuração de IA encontrada. Configure um provedor antes de iniciar a conversa.",
    )

  fontes: list[dict] = []

  try:
    resposta, fontes = gerar_resposta_ia(
      texto,
      configuracao,
      pesquisa_web=pesquisa_web,
    )

  except Exception as error:
    print(f"Erro ao gerar resposta da IA: {error}")
    resposta = "Desculpe, não consegui gerar uma resposta agora. Tente novamente em instantes."

  titulo_atualizado: str | None = None

  if primeira_mensagem:
    try:
      titulo_gerado = gerar_titulo_conversa(texto)

      conversa.titulo = titulo_gerado
      titulo_atualizado = titulo_gerado

      db.commit()
      db.refresh(conversa)
    except Exception as error:
      print(f"Erro ao gerar título da conversa: {error}")

  mensagem_assistente = Mensagem(
    conversa_id=conversa_id,
    usuario="ai",
    texto=resposta,
    modelo=configuracao.modelo,
  )

  db.add(mensagem_assistente)
  db.commit()
  db.refresh(mensagem_assistente)

  return {
    "mensagem_usuario": mensagem_usuario,
    "mensagem_assistente": mensagem_assistente,
    "titulo": titulo_atualizado,
    "fontes": fontes,
    "pesquisa_web_usada": bool(fontes),
  }
