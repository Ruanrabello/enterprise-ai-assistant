from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.bootstrap import ensure_default_user
from core.constants import CURRENT_USER_ID
from database.database import get_db
from database.models.Usuario import Usuario
from database.models.configuracao_ia import ConfiguracaoIA
from schemas.conversa import (
  ConfiguracaoIAResponse,
  ConfiguracaoIAUpdate,
  PerfilResponse,
  PerfilUpdate,
)
from services.LLM.factory import ProviderFactory

router = APIRouter(
  prefix="/configuracoes",
  tags=["Configurações"],
)


def serializar_configuracao(configuracao: ConfiguracaoIA) -> dict[str, object]:
  return {
    "id": configuracao.id,
    "usuario_id": configuracao.usuario_id,
    "provider": configuracao.provider,
    "modelo": configuracao.modelo,
    "possui_api_key": bool(configuracao.api_key),
  }


def obter_usuario_atual(db: Session) -> Usuario:
  usuario = db.query(Usuario).filter(Usuario.id == CURRENT_USER_ID).first()
  return usuario or ensure_default_user(db)


@router.get("/perfil", response_model=PerfilResponse)
def buscar_perfil(db: Session = Depends(get_db)):
  return obter_usuario_atual(db)


@router.put("/perfil", response_model=PerfilResponse)
def atualizar_perfil(dados: PerfilUpdate, db: Session = Depends(get_db)):
  usuario = obter_usuario_atual(db)
  usuario.nome = dados.nome

  db.commit()
  db.refresh(usuario)

  return usuario


@router.get("/ia", response_model=ConfiguracaoIAResponse | None)
def buscar_configuracao_ia(db: Session = Depends(get_db)):
  obter_usuario_atual(db)

  configuracao = db.query(ConfiguracaoIA).filter(
    ConfiguracaoIA.usuario_id == CURRENT_USER_ID
  ).first()

  return serializar_configuracao(configuracao) if configuracao else None


@router.put("/ia", response_model=ConfiguracaoIAResponse)
def atualizar_configuracao_ia(dados: ConfiguracaoIAUpdate, db: Session = Depends(get_db)):
  obter_usuario_atual(db)

  configuracao = db.query(ConfiguracaoIA).filter(
    ConfiguracaoIA.usuario_id == CURRENT_USER_ID
  ).first()

  if configuracao:
    provider_foi_alterado = configuracao.provider != dados.provider

    configuracao.provider = dados.provider
    configuracao.modelo = dados.modelo

    if dados.api_key:
      configuracao.api_key = dados.api_key
    elif provider_foi_alterado:
      configuracao.api_key = None
  else:
    configuracao = ConfiguracaoIA(
      usuario_id=CURRENT_USER_ID,
      provider=dados.provider,
      modelo=dados.modelo,
      api_key=dados.api_key,
    )

    db.add(configuracao)

  db.commit()
  db.refresh(configuracao)

  return serializar_configuracao(configuracao)


@router.post("/ia/testar")
def testar_conexao_ia(dados: ConfiguracaoIAUpdate, db: Session = Depends(get_db)):
  obter_usuario_atual(db)

  try:
    configuracao_teste = dados

    if not dados.api_key and dados.provider != "ollama":
      configuracao_salva = db.query(ConfiguracaoIA).filter(
        ConfiguracaoIA.usuario_id == CURRENT_USER_ID,
        ConfiguracaoIA.provider == dados.provider,
      ).first()

      if configuracao_salva and configuracao_salva.api_key:
        configuracao_teste = dados.model_copy(
          update={"api_key": configuracao_salva.api_key}
        )

    provider = ProviderFactory.criar(configuracao_teste)
    resposta = provider.gerar_resposta("Responda apenas com: ok.")

    if not resposta:
      raise HTTPException(status_code=400, detail="O modelo respondeu vazio.")

    return {"status": "ok", "mensagem": "Conexão bem-sucedida."}
  except HTTPException:
    raise
  except Exception as error:
    raise HTTPException(status_code=400, detail=f"Falha na conexão: {error}")
