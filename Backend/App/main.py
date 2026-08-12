from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import FRONTEND_ORIGINS
from core.bootstrap import ensure_auth_schema
from database.database import Base, engine
from database.models.Conversa import Conversa
from database.models.Documentos import Documento
from database.models.Mensagem import Mensagem
from database.models.Usuario import Usuario
from database.models.configuracao_ia import ConfiguracaoIA
from routers import chat, configuracoes, documentos, relatorios

app = FastAPI(title="AI Business Assistant API")

app.add_middleware(
  CORSMiddleware,
  allow_origins=FRONTEND_ORIGINS,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
ensure_auth_schema(engine)

app.include_router(chat.router)
app.include_router(documentos.router)
app.include_router(relatorios.router)
app.include_router(configuracoes.router)


@app.get("/")
def home():
  return {
    "message": "API funcionando corretamente",
  }
