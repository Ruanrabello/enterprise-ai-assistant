from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.database import Base

if TYPE_CHECKING:
  from database.models.Conversa import Conversa


class Mensagem(Base):
  __tablename__ = "mensagens"

  id: Mapped[int] = mapped_column(primary_key=True, index=True)

  conversa_id: Mapped[int] = mapped_column(
    ForeignKey("conversas.id"),
    nullable=False,
  )

  conversa: Mapped[Conversa] = relationship(
    "Conversa",
    back_populates="mensagens",
  )

  usuario: Mapped[str] = mapped_column(String, nullable=False)

  texto: Mapped[str] = mapped_column(Text, nullable=False)

  modelo: Mapped[str | None] = mapped_column(String, nullable=True)

  created_at: Mapped[datetime] = mapped_column(
    DateTime(timezone=True),
    server_default=func.now(),
  )
