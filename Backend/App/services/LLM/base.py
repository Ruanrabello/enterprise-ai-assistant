from abc import ABC, abstractmethod


class LLMProvider(ABC):
    @abstractmethod
    def gerar_resposta(self, mensagem: str) -> str:
        pass
