import { CircleHelp } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import HelpCenter from "./HelpCenter";

function getPageTitle(pathname: string) {
  if (pathname.startsWith("/chat")) {
    return "Chat";
  }

  if (pathname.startsWith("/documents")) {
    return "Documentos";
  }

  if (pathname.startsWith("/settings")) {
    return "Configurações";
  }

  if (pathname.startsWith("/relatorio")) {
    return "Relatórios";
  }

  return "Dashboard";
}

function Header() {
  const { pathname } = useLocation();
  const pageTitle = getPageTitle(pathname);
  const [isHelpOpen, setIsHelpOpen] = useState(
    () => new URLSearchParams(window.location.search).has("help"),
  );
  const [helpQuery, setHelpQuery] = useState("");

  useEffect(() => {
    function handleHelpRequest(event: Event) {
      const customEvent = event as CustomEvent<{ query?: string }>;
      setHelpQuery(customEvent.detail?.query ?? "");
      setIsHelpOpen(true);
    }

    window.addEventListener("abrir-central-ajuda", handleHelpRequest);

    return () => {
      window.removeEventListener("abrir-central-ajuda", handleHelpRequest);
    };
  }, []);

  return (
    <header className="flex h-15 items-center justify-between border-b border-slate-800 px-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          AI Business Assistant
        </p>

        <h2 className="text-2xl font-bold">{pageTitle}</h2>
      </div>

      <button
        type="button"
        onClick={() => {
          setHelpQuery("");
          setIsHelpOpen(true);
        }}
        aria-label="Abrir central de ajuda"
        aria-haspopup="dialog"
        aria-expanded={isHelpOpen}
        className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
      >
        <CircleHelp aria-hidden="true" size={18} />
        <span className="hidden sm:inline">Ajuda</span>
      </button>

      {isHelpOpen ? (
        <HelpCenter initialQuery={helpQuery} onClose={() => setIsHelpOpen(false)} />
      ) : null}
    </header>
  );
}

export default Header;
