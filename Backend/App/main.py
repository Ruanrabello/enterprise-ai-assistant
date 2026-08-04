from fastapi import FastAPI

from routers import chat
from routers import documentos
from routers import relatorios
from routers import configuracoes

from database.models.Conversa import Conversa
from database.models.Documentos import Documento
from database.models.Mensagem import Mensagem
from database.models.Usuario import Usuario
from database.models.configuracao_ia import ConfiguracaoIA

from database.database import Base, engine

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="AI Business Assistant API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)


app.include_router(chat.router)

app.include_router(documentos.router)

app.include_router(relatorios.router)

app.include_router(configuracoes.router)


@app.get("/")
def home():
    return {
        "message": "API funcionando corretamente"
    }


