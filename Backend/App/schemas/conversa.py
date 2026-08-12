from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

ProviderName = Literal["ollama", "gemini", "grok", "openai", "claude"]
MessageAuthor = Literal["user", "ai"]
WebSearchMode = Literal["auto", "on", "off"]


class ConversaCreate(BaseModel):
  titulo: str = Field(min_length=1, max_length=120)

  @field_validator("titulo")
  @classmethod
  def limpar_titulo(cls, titulo: str) -> str:
    titulo_limpo = " ".join(titulo.split())

    if not titulo_limpo:
      raise ValueError("Informe um título válido.")

    return titulo_limpo


class ConversaResponse(BaseModel):
  model_config = ConfigDict(from_attributes=True)

  id: int
  titulo: str
  usuario_id: int


class MensagensResponse(BaseModel):
  model_config = ConfigDict(from_attributes=True)

  id: int
  conversa_id: int
  usuario: MessageAuthor
  texto: str
  modelo: str | None = None


class NovaMensagemResponse(BaseModel):
  mensagem_usuario: MensagensResponse
  mensagem_assistente: MensagensResponse
  titulo: str | None = None


class MensagemRequest(BaseModel):
    usuario: Literal["user"]
    texto: str = Field(min_length=1)
    pesquisa_web: WebSearchMode = "auto"

    @field_validator("texto")
    @classmethod
    def validar_texto(cls, texto: str) -> str:
        texto_limpo = texto.strip()

        if not texto_limpo:
            raise ValueError("Informe uma mensagem válida.")

        return texto_limpo


class ConfiguracaoIAResponse(BaseModel):
  model_config = ConfigDict(from_attributes=True)

  id: int
  usuario_id: int
  provider: ProviderName
  modelo: str
  possui_api_key: bool = False


class ConfiguracaoIAUpdate(BaseModel):
  provider: ProviderName
  modelo: str = Field(min_length=1, max_length=100)
  api_key: str | None = None

  @field_validator("modelo")
  @classmethod
  def validar_modelo(cls, modelo: str) -> str:
    modelo_limpo = modelo.strip()

    if not modelo_limpo:
      raise ValueError("Informe um modelo válido.")

    return modelo_limpo

  @field_validator("api_key")
  @classmethod
  def normalizar_api_key(cls, api_key: str | None) -> str | None:
    if api_key is None:
      return None

    api_key_limpa = api_key.strip()
    return api_key_limpa or None


class PerfilResponse(BaseModel):
  model_config = ConfigDict(from_attributes=True)

  id: int
  nome: str
  email: str


class PerfilUpdate(BaseModel):
  nome: str = Field(min_length=2, max_length=80)

  @field_validator("nome")
  @classmethod
  def normalizar_nome(cls, nome: str) -> str:
    nome_normalizado = " ".join(nome.split())

    if len(nome_normalizado) < 2:
      raise ValueError("Informe um nome com pelo menos 2 caracteres.")

    return nome_normalizado


class FonteWebResponse(BaseModel):
  titulo: str
  url: str
