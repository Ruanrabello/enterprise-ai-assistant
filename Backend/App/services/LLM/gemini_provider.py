# services/LLM/gemini_provider.py

from google import genai
from .base import LLMProvider


class GeminiProvider(LLMProvider):

    def __init__(self, api_key: str, modelo: str):
        self.client = genai.Client(api_key=api_key)
        self.modelo = modelo


    def gerar_resposta(self, mensagem: str) -> str:
        resposta = self.client.models.generate_content(
            model=self.modelo,
            contents=mensagem
        )

        return resposta.text or ""
