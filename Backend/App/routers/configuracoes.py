from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.database import get_db
from database.models.configuracao_ia import ConfiguracaoIA

from schemas.conversa import (
    ConfiguracaoIAResponse,
    ConfiguracaoIAUpdate
)

from services.LLM.factory import ProviderFactory


router = APIRouter(
    prefix="/configuracoes",
    tags=["Configurações"]
)


@router.get(
    "/ia",
    response_model=ConfiguracaoIAResponse
)
def buscar_configuracao_ia(db: Session = Depends(get_db)):

    configuracao = db.query(ConfiguracaoIA).filter(
        ConfiguracaoIA.usuario_id == 1
    ).first()


    return configuracao



@router.put(
    "/ia",
    response_model=ConfiguracaoIAResponse
)
def atualizar_configuracao_ia( dados: ConfiguracaoIAUpdate, db: Session = Depends(get_db)):

    configuracao = db.query(ConfiguracaoIA).filter(
        ConfiguracaoIA.usuario_id == 1
    ).first()


    if configuracao:

        configuracao.provider = dados.provider
        configuracao.modelo = dados.modelo
        configuracao.api_key = dados.api_key


    else:

        configuracao = ConfiguracaoIA(
            usuario_id=1,
            provider=dados.provider,
            modelo=dados.modelo,
            api_key=dados.api_key
        )

        db.add(configuracao)


    db.commit()
    db.refresh(configuracao)


    return configuracao


@router.post("/ia/testar")
def testar_conexao_ia(dados: ConfiguracaoIAUpdate):
    try:
        provider = ProviderFactory.criar(dados)
        resposta = provider.gerar_resposta("Olá, apenas testando a conexão.")

        if not resposta:
            raise HTTPException(status_code=400, detail="O modelo respondeu vazio.")

        return {"status": "ok", "mensagem": "Conexão bem-sucedida."}

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Falha na conexão: {str(e)}")
