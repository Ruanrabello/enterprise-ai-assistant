from services.LLM.factory import ProviderFactory


def gerar_resposta_ia(texto, configuracao_ia):

    provider = ProviderFactory.criar(configuracao_ia)

    return provider.gerar_resposta(texto)
