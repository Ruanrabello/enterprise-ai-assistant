from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from database.database import Base


class ConfiguracaoIA(Base):

    __tablename__ = "configuracoes_ia"

    id = Column(Integer, primary_key=True)

    usuario_id = Column(
        Integer,
        ForeignKey("usuarios.id"),
        nullable=False
    )

    provider = Column(
        String,
        default="ollama"
    )

    modelo = Column(
        String,
        default="qwen3:8b"
    )

    api_key = Column(
        String,
        nullable=True
    )


    usuario = relationship(
        "Usuario",
        back_populates="configuracao_ia"
    )
