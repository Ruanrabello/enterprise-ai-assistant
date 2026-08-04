from .ollama_provider import OllamaProvider
from .gemini_provider import GeminiProvider
from .grok_provider import GrokProvider


class ProviderFactory:

    @staticmethod
    def criar(config):

        if config.provider == "ollama":
            return OllamaProvider(
                config.modelo
            )

        if config.provider == "gemini":
            return GeminiProvider(
                config.api_key,
                config.modelo
            )

        if config.provider == "grok":
            return GrokProvider(
                config.api_key,
                config.modelo
            )

        raise ValueError(
            f"Fornecedor desconhecido: {config.provider}"
        )
