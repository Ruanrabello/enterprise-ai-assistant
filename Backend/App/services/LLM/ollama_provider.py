from langchain_ollama import OllamaLLM
from .base import LLMProvider


class OllamaProvider(LLMProvider):

    def __init__(self, modelo: str):

        self.modelo = OllamaLLM(model=modelo)

    def gerar_resposta(self, mensagem: str) -> str:

        return self.modelo.invoke(mensagem)
