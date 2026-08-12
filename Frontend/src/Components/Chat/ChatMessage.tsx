import { Bot, ExternalLink, Globe2 } from "lucide-react";
import { lazy, Suspense } from "react";
import type { WebSource } from "../../types/chat";

const MarkdownContent = lazy(() => import("./MarkdownContent"));

type MensagemChatProps = {
  texto: string;
  usuario: "user" | "ai";
  modelo?: string | null;
  fontes?: WebSource[];
  pesquisaWebUsada?: boolean;
};

function MensagemChat({
  texto,
  usuario,
  modelo,
  fontes = [],
  pesquisaWebUsada = false,
}: MensagemChatProps) {
  if (usuario === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[70%] whitespace-pre-wrap rounded-2xl bg-cyan-500 px-4 py-3 text-white shadow-sm">
          {texto}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700">
        <Bot size={18} className="text-cyan-400" />
      </div>

      <div className="min-w-0 max-w-[85%] rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 sm:max-w-[80%]">
        {pesquisaWebUsada && (
          <div className="mb-3 flex items-center gap-1.5 text-xs text-cyan-400">
            <Globe2 size={14} />
            <span>Resposta com pesquisa na web</span>
          </div>
        )}

        <Suspense
          fallback={<div className="whitespace-pre-wrap text-slate-200">{texto}</div>}
        >
          <MarkdownContent>{texto}</MarkdownContent>
        </Suspense>

        {fontes.length > 0 && (
          <div className="mt-4 border-t border-slate-800 pt-3">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              Fontes
            </p>

            <div className="flex flex-wrap gap-2">
              {fontes.map((fonte, index) => (
                <a
                  key={`${fonte.url}-${index}`}
                  href={fonte.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex max-w-full items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-300 transition hover:border-cyan-500 hover:text-cyan-300"
                  title={fonte.url}
                >
                  <span className="max-w-56 truncate">
                    {index + 1}. {fonte.titulo || "Fonte"}
                  </span>
                  <ExternalLink size={12} className="shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}

        {modelo && (
          <p className="mt-2 text-xs text-slate-500">
            {modelo}
          </p>
        )}
      </div>
    </div>
  );
}

export default MensagemChat;
