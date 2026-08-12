from .claude_provider import ClaudeProvider
from .gemini_provider import GeminiProvider
from .grok_provider import GrokProvider
from .ollama_provider import OllamaProvider
from .openai_provider import OpenAIProvider


class ProviderFactory:
  @staticmethod
  def criar(config):
    api_key = getattr(config, "api_key", None)

    if config.provider != "ollama" and not api_key:
      raise ValueError(f"Informe a API key do provedor {config.provider}.")

    if config.provider == "ollama":
      return OllamaProvider(config.modelo)

    if config.provider == "gemini":
      return GeminiProvider(api_key, config.modelo)

    if config.provider == "grok":
      return GrokProvider(api_key, config.modelo)

    if config.provider == "openai":
      return OpenAIProvider(api_key, config.modelo)

    if config.provider == "claude":
      return ClaudeProvider(api_key, config.modelo)

    raise ValueError(f"Fornecedor desconhecido: {config.provider}")
