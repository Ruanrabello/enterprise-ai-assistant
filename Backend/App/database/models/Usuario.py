from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from database.database import Base


class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)

    nome = Column(String, nullable=False)

    email = Column(String, unique=True, nullable=False)

    conversas = relationship(
        "Conversa",
        back_populates="usuario"
    )

    configuracao_ia = relationship(
        "ConfiguracaoIA",
        back_populates="usuario",
        uselist=False
    )
