from pydantic import BaseModel


class ConversaCreate(BaseModel):
    titulo: str


class ConversaResponse(BaseModel):
    id: int
    titulo: str
    usuario_id: int

    class Config:
        from_attributes = True

class MensagensResponse(BaseModel):
    id: int
    conversa_id: int
    usuario: str
    texto: str
    modelo: str | None = None

    class Config:
        from_attributes = True

class MensagemRequest(BaseModel):
    usuario: str
    texto: str


class ConfiguracaoIAResponse(BaseModel):
    id: int
    usuario_id: int
    provider: str
    modelo: str
    api_key: str | None = None

    class Config:
        from_attributes = True


class ConfiguracaoIAUpdate(BaseModel):
    provider: str
    modelo: str
    api_key: str | None = None
