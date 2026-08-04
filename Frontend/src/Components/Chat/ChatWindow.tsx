import ChatInput from "./ChatInput";
import MensagemChat from "./ChatMessage";
import api from "../../Services/api";
import { useCallback, useEffect, useRef, useState } from "react";


type MensagemChatPropriedades = {
    id: number | string;
    usuario: "user" | "ai";
    texto: string;
    modelo?: string | null;
};

type ChatWindowProps = {
  conversaId?: string;
};


function ChatWindow({ conversaId }: ChatWindowProps){

  const [mensagens, setMensagens] = useState<MensagemChatPropriedades[]>([]);
  const [texto, setTexto] = useState("");
  const [carregandoResposta, setCarregandoResposta] = useState(false);
  const [configuracaoOk, setConfiguracaoOk] = useState<boolean | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const carregarMensagens = useCallback(async () => {
    if (!conversaId) return;
    try {
      const response = await api.get(`/chat/${conversaId}/mensagens`);
      setMensagens(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [conversaId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    carregarMensagens();
  }, [carregarMensagens]);

  useEffect(() => {
    async function verificarConfiguracao() {
      try {
        const response = await api.get("/configuracoes/ia");
        setConfiguracaoOk(!!response.data);
      } catch (error) {
        console.error(error);
        setConfiguracaoOk(false);
      }
    }
    verificarConfiguracao();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [mensagens, carregandoResposta]);


  async function enviarMensagem() {

    if (texto.trim() === "" || !configuracaoOk) return;

    const textoEnviado = texto;

    const mensagemTemporaria: MensagemChatPropriedades = {
      id: `temp-${Date.now()}`,
      usuario: "user",
      texto: textoEnviado,
    };

    setMensagens((atual) => [...atual, mensagemTemporaria]);
    setTexto("");
    setCarregandoResposta(true);

    try {

      await api.post(`/chat/${conversaId}/mensagens`, {
        usuario: "user",
        texto: textoEnviado,
      });

      await carregarMensagens();

    } catch (error) {

      console.error(error);

      setMensagens((atual) => atual.filter((m) => m.id !== mensagemTemporaria.id));

    } finally {
      setCarregandoResposta(false);
    }

}

return (

<div className="
flex
flex-col
h-full
min-h-0
">


<div
  ref={scrollRef}
  className="
flex-1
space-y-4
overflow-y-auto
p-6
border
border-slate-800
rounded-xl
bg-slate-950
"
>

{mensagens.length === 0 && !carregandoResposta ? (
  <div className="h-full flex flex-col items-center justify-center text-center gap-2">
    <h2 className="text-2xl font-semibold text-white">
      Como posso ajudar hoje?
    </h2>
    <p className="text-slate-400 max-w-md">
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
      />
    ))}

    {carregandoResposta && (
      <div className="flex justify-start">
        <div className="
          max-w-[70%]
          rounded-xl
          px-4
          py-3
          bg-slate-800
          text-slate-400
          flex
          items-center
          gap-1
        ">
          <span>Pensando</span>
          <span className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
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
    desabilitado={configuracaoOk === false}
/>

{configuracaoOk === false && (
  <p className="text-sm text-red-400 mt-2 text-center">
    Nenhum modelo de IA configurado. Acesse Configurações para escolher um provedor.
  </p>
)}
</div>


</div>

);


}


export default ChatWindow;
