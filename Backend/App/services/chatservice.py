from sqlalchemy.orm import Session

from database.models.Conversa import Conversa

from database.models.Mensagem import Mensagem

from services.ia_service import gerar_resposta_ia

from database.models.configuracao_ia import ConfiguracaoIA




def criar_conversa(
    db: Session,
    titulo: str,
    usuario_id: int
):
    conversa = Conversa(
        titulo=titulo,
        usuario_id=usuario_id
    )

    db.add(conversa)

    db.commit()

    db.refresh(conversa)

    return conversa



def listar_conversas(db: Session, usuario_id: int):
    return (
        db.query(Conversa)
        .filter(Conversa.usuario_id == usuario_id)
        .all()
    )

# -----------------------------------------------------------

def listar_mensagens(db:Session, conversa_id: int):
    return (
        db.query(Mensagem)
        .filter(Mensagem.conversa_id == conversa_id)
        .all()
    )


def criar_mensagem(
        db: Session,
        conversa_id: int,
        usuario: str,
        texto: str
):
    mensagem = Mensagem(
        conversa_id = conversa_id,
        usuario = usuario,
        texto = texto
    )

    db.add(mensagem)
    db.commit()
    db.refresh(mensagem)

    configuracao = db.query(ConfiguracaoIA).filter(
        ConfiguracaoIA.usuario_id == 1
    ).first()

    if not configuracao:
        configuracao = ConfiguracaoIA(
            usuario_id=1,
            provider="ollama",
            modelo="qwen3:8b"
        )

        db.add(configuracao)
        db.commit()
        db.refresh(configuracao)

    try:
        resposta = gerar_resposta_ia(texto, configuracao)
    except Exception as e:
        resposta = "Desculpe, não consegui gerar uma resposta agora. Tente novamente."
        print(f"Erro ao gerar resposta da IA: {e}")

    mensagem_ai = Mensagem(
        conversa_id = conversa_id,
        usuario = 'ai',
        texto = resposta,
        modelo = configuracao.modelo if configuracao else None
    )

    db.add(mensagem_ai)
    db.commit()
    db.refresh(mensagem_ai)

    return mensagem
