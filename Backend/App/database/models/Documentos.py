from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from database.database import Base


class Documento(Base):
    __tablename__ = "documentos"

    id = Column(Integer, primary_key=True, index=True)

    nome = Column(String, nullable=False)

    tipo = Column(String, nullable=False)

    caminho_storage = Column(String, nullable=False)

    status = Column(String, nullable=False)


    created_at = Column(DateTime(timezone=True), server_default=func.now())
