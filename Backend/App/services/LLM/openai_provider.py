from openai import OpenAI

from .base import LLMProvider


class OpenAIProvider(LLMProvider):

    def __init__(self, api_key: str, modelo: str):
        self.client = OpenAI(api_key=api_key)
        self.modelo = modelo

    def gerar_resposta(self, mensagem: str) -> str:
        resposta = self.client.responses.create(
            model=self.modelo,
            input=mensagem,
        )

        return resposta.output_text or ""
