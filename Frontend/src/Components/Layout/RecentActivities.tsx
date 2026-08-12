import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import api from "../../Services/api";
import type { Conversation } from "../../types/chat";

function ConversasRecentes() {
  const [conversas, setConversas] = useState<Conversation[]>([]);
  const location = useLocation();

  useEffect(() => {
    let ativo = true;

    async function carregarConversas() {
      try {
        const response = await api.get<Conversation[]>("/chat/conversas");

        if (ativo) {
          setConversas(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    }

    void carregarConversas();

    return () => {
      ativo = false;
    };
  }, [location.pathname]);

  return (
    <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-4 text-sm font-semibold text-white">
        Conversas recentes
      </h2>

      <div className="flex-1 space-y-1 overflow-y-auto pr-2">
        {conversas.length === 0 && (
          <p className="text-sm text-slate-500">
            Nenhuma conversa criada ainda.
          </p>
        )}

        {conversas.map((conversa) => (
          <NavLink
            key={conversa.id}
            to={`/chat/${conversa.id}`}
            className="flex items-center gap-2 rounded-md p-2 transition hover:bg-slate-800"
          >
            <div className="h-2 w-2 rounded-full bg-cyan-400" />

            <p className="truncate text-sm text-slate-300">
              {conversa.titulo}
            </p>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default ConversasRecentes;
