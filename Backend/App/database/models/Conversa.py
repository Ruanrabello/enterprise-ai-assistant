from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database.database import Base

class Conversa(Base):
    __tablename__ = "conversas"

    id = Column(Integer, primary_key=True, index=True)

    titulo = Column(String, nullable=False)

    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)   # usuarios = nome da tabela (__tablename__), id = coluna dessa tabel

    usuario = relationship("Usuario", back_populates="conversas")

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    mensagens = relationship( "Mensagem", back_populates="conversa", cascade="all, delete-orphan")
