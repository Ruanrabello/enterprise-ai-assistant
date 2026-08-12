import anthropic

from .base import LLMProvider


class ClaudeProvider(LLMProvider):

    def __init__(self, api_key: str, modelo: str):
        self.client = anthropic.Anthropic(api_key=api_key)
        self.modelo = modelo

    def gerar_resposta(self, mensagem: str) -> str:
        resposta = self.client.messages.create(
            model=self.modelo,
            max_tokens=2048,
            messages=[{"role": "user", "content": mensagem}],
        )

        blocos_texto = [
            bloco.text
            for bloco in resposta.content
            if bloco.type == "text"
        ]

        return "\n".join(blocos_texto)
