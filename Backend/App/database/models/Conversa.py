from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.database import Base

if TYPE_CHECKING:
  from database.models.Mensagem import Mensagem
  from database.models.Usuario import Usuario


class Conversa(Base):
  __tablename__ = "conversas"

  id: Mapped[int] = mapped_column(primary_key=True, index=True)

  titulo: Mapped[str] = mapped_column(String, nullable=False)

  usuario_id: Mapped[int] = mapped_column(
    ForeignKey("usuarios.id"),
    nullable=False,
  )

  usuario: Mapped[Usuario] = relationship(
    "Usuario",
    back_populates="conversas",
  )

  created_at: Mapped[datetime] = mapped_column(
    DateTime(timezone=True),
    server_default=func.now(),
  )

  mensagens: Mapped[list[Mensagem]] = relationship(
    "Mensagem",
    back_populates="conversa",
    cascade="all, delete-orphan",
  )
