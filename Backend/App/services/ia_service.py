import re                                                                                                             # Biblioteca usada para limpar a conversa, espacamento etc
from services.LLM.factory import ProviderFactory                                                                      # Aqui eu importo a funcao responsavel por descobrir qual ia o usuario escolheu
from services.web_search_service import (WebSearchMode, deve_pesquisar_web,                                           # Estamos importando 4 coisas improtates:  WebSearckMode(Representa os modos)
montar_prompt_com_web, pesquisar_web,)                                                                                # deve_pesquisar_web(Decide se deve pesquisar a pergunta na internet caso for o modo for auto)
                                                                                                                      # pesquisar_web(Faz a pesquisa usando o sdk Tavily)
                                                                                                                      # montar_prompt_com_web(Pega os resultados encontrados e monta um texto para entregar à IA.)







def gerar_resposta_ia(texto: str, configuracao_ia, pesquisa_web: WebSearchMode = "auto",) -> tuple[str, list[dict]]:  # Funcao que vai gerar a resposta da IA(texto: str) = mensagem do usuario, configuracao_ia = configuracao q busca no banco, como modelo e apikey
                                                                                                                      # e provider, A função também recebe o modo da pesquisa. por padrao e auto)

  provider = ProviderFactory.criar(configuracao_ia)                                                                   # Basicamente provider passa a ser a ia sem  agnte precisar se preoucupar em modelo o usuario escolheru, porem a toda mensagem ele vai buscar no campos as configs e criar a varaivel

  if not deve_pesquisar_web(texto, pesquisa_web):                                                                     # Se a funcao retornar false entao nao pesquisa na intenet, vai direto na ia
    return provider.gerar_resposta(texto), []

  resultados = pesquisar_web(texto)                                                                                   # Se a funcaor retornar True, ele pesquisa na web usando o Tavily(recebe: titulo, url, conteudo) armazena tudo isso em resultado

  if not resultados:                                                                                                  # Se a pesquisa nao encontrar nada
    return provider.gerar_resposta(texto), []                                                                         # Ai usamos a ia normalmete

  prompt_com_web = montar_prompt_com_web(texto, resultados)                                                           # Aqui ele monta um pronpt normalmente usando a funcao e conteudo que ta na variavel resuultado
  resposta = provider.gerar_resposta(prompt_com_web)                                                                  # Dps ele manda o pronpt para a ia


  fontes = []                                                                                                         # Basicamente uma lista de dicionarios com titulo e url

  for resultado in resultados:
      fonte = {
          "titulo": resultado["titulo"],
          "url": resultado["url"],
      }

      fontes.append(fonte)

  return resposta, fontes                                                                                             # Retornamos a resposta final gerada pela com as urls e titulos







# Funcao de gerar titulo
def gerar_titulo_conversa(texto: str) -> str:
  texto_limpo = re.sub(r"\s+", " ", texto).strip()                                        # Basicamente remove espacos, padroniza o texto, tira "" ou `` ou / etc
  texto_limpo = re.sub(r"[\"'`]+", "", texto_limpo)

  if not texto_limpo:                                                                     # Se depois da limpeza nao sobrou nada o titulo do chat vai ser nova conversa
    return "Nova conversa"

  palavras = texto_limpo.split(" ")                                                       # Aqui ele pega o texto depois de limpo(lembrando que esse texto que essa funcao recebe sempre e a primeira pergunta que o usuario faz apos criar a nova conversa) ele quebra fazendo uma lista de palavras
  titulo = " ".join(palavras[:6]).strip(" .,:;!-")                                        # Ele pega as primeiras 6 palavras e junta novamente / o strip remove pontuações desnecessárias das extremidades.

  return titulo[:60] or "Nova conversa"                                                   # Retorna  no maximo 60 caracteres
