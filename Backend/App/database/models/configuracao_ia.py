from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.database import Base

if TYPE_CHECKING:
    from database.models.Usuario import Usuario


class ConfiguracaoIA(Base):

    __tablename__ = "configuracoes_ia"

    id: Mapped[int] = mapped_column(primary_key=True)

    usuario_id: Mapped[int] = mapped_column(
        ForeignKey("usuarios.id"),
        nullable=False
    )

    provider: Mapped[str] = mapped_column(
        String,
        default="ollama",
        nullable=False
    )

    modelo: Mapped[str] = mapped_column(
        String,
        default="qwen3:8b",
        nullable=False
    )

    api_key: Mapped[str | None] = mapped_column(
        String,
        nullable=True
    )

    usuario: Mapped[Usuario] = relationship(
        "Usuario",
        back_populates="configuracao_ia"
    )
