from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database.database import Base

class Mensagem(Base):
    __tablename__ = "mensagens"

    id = Column(Integer, primary_key=True, index=True)

    conversa_id = Column(Integer, ForeignKey("conversas.id"), nullable=False)
    conversa = relationship( "Conversa", back_populates="mensagens")

    usuario = Column(String, nullable=False)   # "user" ou "ai"

    texto = Column(Text, nullable=False)

    modelo = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
