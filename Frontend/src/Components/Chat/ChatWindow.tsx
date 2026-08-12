import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import api from "../../Services/api";
import type {
  ChatMessage,
  NewMessageResponse,
  WebSearchMode,
} from "../../types/chat";
import type { AIConfigurationResponse } from "../../types/settings";
import ChatInput from "./ChatInput";
import MensagemChat from "./ChatMessage";

type ChatWindowProps = {
  conversaId?: string;
};

function ChatWindow({ conversaId }: ChatWindowProps) {
  const [mensagens, setMensagens] = useState<ChatMessage[]>([]);
  const [texto, setTexto] = useState("");
  const [pesquisaWeb, setPesquisaWeb] = useState<WebSearchMode>("auto");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isConfigurationReady, setIsConfigurationReady] = useState<boolean | null>(null);
  const [erroMensagem, setErroMensagem] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);

  const carregarMensagens = useCallback(async () => {
    if (!conversaId) {
      setMensagens([]);
      return;
    }

    try {
      const response = await api.get<ChatMessage[]>(`/chat/${conversaId}/mensagens`);
      setMensagens(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [conversaId]);

  useEffect(() => {
    // O carregamento inicial do histórico depende do ID da conversa e é disparado apenas nessa sincronização.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void carregarMensagens();
  }, [carregarMensagens]);

  useEffect(() => {
    let active = true;

    async function verificarConfiguracao() {
      try {
        const response = await api.get<AIConfigurationResponse | null>("/configuracoes/ia");

        if (active) {
          setIsConfigurationReady(Boolean(response.data?.provider && response.data.modelo));
        }
      } catch (error) {
        console.error(error);

        if (active) {
          setIsConfigurationReady(false);
        }
      }
    }

    void verificarConfiguracao();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [mensagens, isSendingMessage]);

  async function enviarMensagem() {
    const textoEnviado = texto.trim();

    if (!conversaId || !textoEnviado || isConfigurationReady !== true) {
      return;
    }

    const mensagemTemporaria: ChatMessage = {
      id: `temp-${Date.now()}`,
      usuario: "user",
      texto: textoEnviado,
    };

    setMensagens((mensagensAtuais) => [...mensagensAtuais, mensagemTemporaria]);
    setTexto("");
    setErroMensagem("");
    setIsSendingMessage(true);

    try {
      const response = await api.post<NewMessageResponse>(
        `/chat/${conversaId}/mensagens`,
        {
          usuario: "user",
          texto: textoEnviado,
          pesquisa_web: pesquisaWeb,
        },
        {
          timeout: 120000,
        },
      );

      const mensagemAssistenteComWeb: ChatMessage = {
        ...response.data.mensagem_assistente,
        fontes: response.data.fontes,
        pesquisa_web_usada: response.data.pesquisa_web_usada,
      };

      setMensagens((mensagensAtuais) => [
        ...mensagensAtuais.filter((mensagem) => mensagem.id !== mensagemTemporaria.id),
        response.data.mensagem_usuario,
        mensagemAssistenteComWeb,
      ]);
    } catch (error) {
      console.error(error);
      setMensagens((mensagensAtuais) =>
        mensagensAtuais.filter((mensagem) => mensagem.id !== mensagemTemporaria.id),
      );

      if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
        setErroMensagem("A resposta da IA demorou mais do que o esperado. Tente novamente ou use um modelo mais leve.");
      } else {
        setErroMensagem("Não foi possível enviar sua mensagem agora. Tente novamente.");
      }
    } finally {
      setIsSendingMessage(false);
    }
  }

  const semConversaSelecionada = !conversaId;
  const inputDesabilitado = semConversaSelecionada || isConfigurationReady !== true;
  const placeholder = semConversaSelecionada
    ? "Crie ou selecione uma conversa para começar."
    : isConfigurationReady === null
      ? "Verificando configuração de IA..."
      : isConfigurationReady === false
        ? "Configure um modelo de IA primeiro..."
        : "Envie uma mensagem...";

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 p-6"
      >
        {semConversaSelecionada ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <h2 className="text-2xl font-semibold text-white">
              Nenhuma conversa selecionada
            </h2>
            <p className="max-w-md text-slate-400">
              Use o botão "Novo chat" ou escolha uma conversa recente na barra lateral.
            </p>
          </div>
        ) : mensagens.length === 0 && !isSendingMessage ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <h2 className="text-2xl font-semibold text-white">
              Como posso ajudar hoje?
            </h2>
            <p className="max-w-md text-slate-400">
              Envie uma mensagem para começar a conversa com seu assistente.
            </p>
          </div>
        ) : (
          <>
            {mensagens.map((mensagem) => (
              <MensagemChat
                key={mensagem.id}
                texto={mensagem.texto}
                usuario={mensagem.usuario}
                modelo={mensagem.modelo}
                fontes={mensagem.fontes}
                pesquisaWebUsada={mensagem.pesquisa_web_usada}
              />
            ))}

            {isSendingMessage && (
              <div className="flex justify-start">
                <div className="flex max-w-[70%] items-center gap-1 rounded-xl bg-slate-800 px-4 py-3 text-slate-400">
                  <span>{pesquisaWeb === "on" ? "Pesquisando e pensando" : "Pensando"}</span>
                  <span className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-4">
        <ChatInput
          texto={texto}
          aoAlterarTexto={setTexto}
          aoEnviar={enviarMensagem}
          pesquisaWeb={pesquisaWeb}
          aoAlterarPesquisaWeb={setPesquisaWeb}
          desabilitado={inputDesabilitado}
          placeholder={placeholder}
        />

        {isConfigurationReady === false && conversaId && (
          <p className="mt-2 text-center text-sm text-red-400">
            Nenhum modelo de IA configurado. Acesse Configurações para escolher um provedor.
          </p>
        )}

        {erroMensagem && (
          <p className="mt-2 text-center text-sm text-red-400">
            {erroMensagem}
          </p>
        )}
      </div>
    </div>
  );
}

export default ChatWindow;
