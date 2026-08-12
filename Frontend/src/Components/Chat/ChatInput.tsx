import { Globe2, Paperclip, Send } from "lucide-react";
import type { WebSearchMode } from "../../types/chat";

type ChatInputProps = {
  texto: string;
  aoAlterarTexto: (texto: string) => void;
  aoEnviar: () => void;
  pesquisaWeb: WebSearchMode;
  aoAlterarPesquisaWeb: (modo: WebSearchMode) => void;
  desabilitado?: boolean;
  placeholder?: string;
};

function ChatInput({
  texto,
  aoAlterarTexto,
  aoEnviar,
  pesquisaWeb,
  aoAlterarPesquisaWeb,
  desabilitado,
  placeholder,
}: ChatInputProps) {
  function enviar() {
    if (texto.trim() === "" || desabilitado) {
      return;
    }

    aoEnviar();
  }

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={desabilitado}
          className="text-slate-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Anexar arquivo"
        >
          <Paperclip size={20} />
        </button>

        <input
          type="text"
          aria-label="Mensagem do chat"
          value={texto}
          onChange={(event) => aoAlterarTexto(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              enviar();
            }
          }}
          placeholder={placeholder ?? "Envie uma mensagem..."}
          disabled={desabilitado}
          className="flex-1 bg-transparent text-white outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
        />

        <button
          type="button"
          onClick={enviar}
          disabled={texto.trim() === "" || desabilitado}
          className="rounded-xl bg-white p-2 text-black transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Enviar mensagem"
        >
          <Send size={20} />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-slate-800 pt-3">
        <Globe2
          size={16}
          className={pesquisaWeb === "off" ? "text-slate-500" : "text-cyan-400"}
        />

        <span className="text-xs text-slate-400">Pesquisa web</span>

        <select
          value={pesquisaWeb}
          onChange={(event) =>
            aoAlterarPesquisaWeb(event.target.value as WebSearchMode)
          }
          disabled={desabilitado}
          aria-label="Modo da pesquisa web"
          className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs text-slate-200 outline-none transition focus:border-cyan-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <option value="auto">Auto</option>
          <option value="on">Ligado</option>
          <option value="off">Desligado</option>
        </select>
      </div>
    </div>
  );
}

export default ChatInput;
