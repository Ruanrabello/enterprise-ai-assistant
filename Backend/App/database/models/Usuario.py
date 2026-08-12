from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.database import Base

if TYPE_CHECKING:
    from database.models.Conversa import Conversa
    from database.models.configuracao_ia import ConfiguracaoIA


class Usuario(Base):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    nome: Mapped[str] = mapped_column(String, nullable=False)

    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)

    supabase_id: Mapped[str | None] = mapped_column(
        String,
        unique=True,
        index=True,
        nullable=True,
    )

    conversas: Mapped[list[Conversa]] = relationship(
        "Conversa",
        back_populates="usuario"
    )

    configuracao_ia: Mapped[ConfiguracaoIA | None] = relationship(
        "ConfiguracaoIA",
        back_populates="usuario",
        uselist=False
    )
