import { useLocation } from "react-router-dom";

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

  return (
    <header className="flex h-15 items-center justify-between border-b border-slate-800 px-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          AI Business Assistant
        </p>

        <h2 className="text-2xl font-bold">{pageTitle}</h2>
      </div>
    </header>
  );
}

export default Header;
