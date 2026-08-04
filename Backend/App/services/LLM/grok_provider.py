# services/LLM/grok_provider.py
from openai import OpenAI
from .base import LLMProvider


class GrokProvider(LLMProvider):

    def __init__(self, api_key: str, modelo: str):
        self.client = OpenAI(
            api_key=api_key,
            base_url="https://api.x.ai/v1"
        )
        self.modelo = modelo

    def gerar_resposta(self, mensagem: str) -> str:
        resposta = self.client.chat.completions.create(
            model=self.modelo,
            messages=[{"role": "user", "content": mensagem}]
        )
        return resposta.choices[0].message.content or ""
