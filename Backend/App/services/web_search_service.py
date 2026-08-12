import os
import re
from typing import Literal

from dotenv import load_dotenv
from tavily import TavilyClient

load_dotenv()

WebSearchMode = Literal["auto", "on", "off"]

# Termos que normalmente indicam que a resposta depende de informação atual.
TERMOS_ATUAIS = (
    "hoje",
    "agora",
    "atual",
    "atualmente",
    "recente",
    "recentes",
    "última",
    "ultimo",
    "último",
    "ultimas",
    "últimas",
    "notícia",
    "noticias",
    "notícias",
    "preço",
    "cotação",
    "dólar",
    "dolar",
    "euro",
    "clima",
    "tempo em",
    "placar",
    "resultado do jogo",
    "versão atual",
    "versao atual",
    "lançamento",
    "lancamento",
    "disponível",
    "disponivel",
)


def deve_pesquisar_web(pergunta: str, modo: WebSearchMode = "auto") -> bool:
    """Decide se a pergunta deve usar pesquisa web."""
    if modo == "on":
        return True

    if modo == "off":
        return False

    texto = re.sub(r"\s+", " ", pergunta.lower()).strip()
    return any(termo in texto for termo in TERMOS_ATUAIS)


def pesquisar_web(pergunta: str, max_resultados: int = 5) -> list[dict]:
    """Pesquisa a pergunta na Tavily e normaliza os resultados."""
    api_key = os.getenv("TAVILY_API_KEY")

    if not api_key:
        raise ValueError(
            "TAVILY_API_KEY não configurada. Adicione a chave da Tavily ao arquivo .env."
        )

    cliente = TavilyClient(api_key=api_key)

    resposta = cliente.search(
        query=pergunta,
        search_depth="basic",
        max_results=max_resultados,
        include_answer=False,
        include_raw_content=False,
    )

    resultados = []

    for item in resposta.get("results", []):
        titulo = (item.get("title") or "Fonte sem título").strip()
        url = (item.get("url") or "").strip()
        conteudo = (item.get("content") or "").strip()

        if not url or not conteudo:
            continue

        resultados.append(
            {
                "titulo": titulo,
                "url": url,
                "conteudo": conteudo,
            }
        )

    return resultados


def montar_prompt_com_web(pergunta: str, resultados: list[dict]) -> str:
    """Monta o contexto web que será enviado ao provider de IA escolhido."""
    fontes_formatadas = []

    for indice, fonte in enumerate(resultados, start=1):
        fontes_formatadas.append(
            "\n".join(
                [
                    f"[Fonte {indice}] {fonte['titulo']}",
                    f"URL: {fonte['url']}",
                    f"Conteúdo: {fonte['conteudo']}",
                ]
            )
        )

    contexto = "\n\n".join(fontes_formatadas)

    return f"""
Você é um assistente de IA com acesso a resultados de pesquisa da internet.

Responda à pergunta do usuário usando os resultados abaixo como fonte principal para informações atuais.
Não invente fatos que não estejam sustentados pelos resultados.
Quando usar uma informação de uma fonte, indique a referência no formato [Fonte N].
Se os resultados forem insuficientes ou conflitantes, deixe isso claro.
Não liste URLs no corpo da resposta; as fontes serão exibidas separadamente pela aplicação.

PERGUNTA DO USUÁRIO:
{pergunta}

RESULTADOS DA PESQUISA WEB:
{contexto}
""".strip()
