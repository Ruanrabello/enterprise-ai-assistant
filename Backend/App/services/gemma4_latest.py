from langchain_ollama import OllamaLLM

modelo = OllamaLLM(
    model="gemma4:latest"
)

def gerar_resposta_ia(texto_usuario: str):

    resposta = modelo.invoke(texto_usuario)

    return resposta
