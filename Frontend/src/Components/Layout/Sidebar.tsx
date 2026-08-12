import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth/auth-context";
import api from "../../Services/api";
import type { ProfileResponse } from "../../types/settings";
import ConversasRecentes from "./RecentActivities";

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

const NAVIGATION_ITEMS = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/",
  },
  {
    icon: BarChart3,
    label: "Relatórios",
    path: "/relatorio",
  },
  {
    icon: FileText,
    label: "Documentos",
    path: "/documents",
  },
  {
    icon: Settings,
    label: "Configurações",
    path: "/settings",
  },
] as const;

function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const metadataName = user?.user_metadata.nome;
  const authenticatedName =
    typeof metadataName === "string" ? metadataName.trim() : "";
  const [profileName, setProfileName] = useState(
    () => authenticatedName || user?.email?.split("@")[0] || "Usuário",
  );
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const response = await api.get<ProfileResponse>("/configuracoes/perfil");

        if (active) {
          setProfileName(response.data.nome);
        }
      } catch (error) {
        console.error(error);
      }
    }

    const handleProfileUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<{ nome?: string }>;
      const updatedName = customEvent.detail?.nome?.trim();

      if (updatedName) {
        setProfileName(updatedName);
      }
    };

    void loadProfile();
    window.addEventListener("perfil-atualizado", handleProfileUpdated);

    return () => {
      active = false;
      window.removeEventListener("perfil-atualizado", handleProfileUpdated);
    };
  }, []);

  async function createConversation() {
    setIsCreatingConversation(true);

    try {
      const response = await api.post("/chat/conversas", {
        titulo: "Nova conversa",
      });

      navigate(`/chat/${response.data.id}`);
    } catch (error) {
      console.error("Erro ao criar conversa", error);
    } finally {
      setIsCreatingConversation(false);
    }
  }

  async function handleSignOut() {
    setIsSigningOut(true);

    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Não foi possível sair da conta:", error);
    } finally {
      setIsSigningOut(false);
    }
  }

  const profileInitial = profileName.trim().charAt(0).toUpperCase() || "U";

  return (
    <aside
      className={`
        ${collapsed ? "w-20" : "w-75"}
        flex
        h-screen
        flex-col
        border-r
        border-slate-800
        bg-slate-900
        p-1.5
        transition-all
        duration-300
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          {!collapsed ? (
            <div className="rounded-lg px-3 py-3">
              <img
                src="/Logo.png"
                alt="Logo do AI Business Assistant"
                className="h-14 w-18 object-contain"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center p-3">
              <img
                src="/Logo.png"
                alt="Logo do AI Business Assistant"
                className="h-6 w-6 object-contain"
              />
            </div>
          )}
        </div>

        <div className="p-3">
          <button
            onClick={onToggle}
            className="rounded-lg p-1 text-slate-300 hover:bg-slate-800"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>
      </div>

      <div className="mt-10">
        <button
          onClick={createConversation}
          disabled={isCreatingConversation}
          className="flex w-full items-center gap-3 rounded-lg bg-cyan-500/10 p-3 text-cyan-300 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <MessageSquare size={15} />

          {!collapsed && (
            <span>{isCreatingConversation ? "Criando..." : "Novo chat"}</span>
          )}
        </button>
      </div>

      <nav className="mt-4 space-y-2">
        {NAVIGATION_ITEMS.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              `
                flex
                items-center
                gap-3
                rounded-lg
                p-3
                transition
                ${
                  isActive
                    ? "bg-slate-700 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }
              `
            }
          >
            <Icon size={15} />

            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="flex-1 overflow-hidden px-3 pt-6">
        {!collapsed && (
          <div className="h-full overflow-y-auto">
            <ConversasRecentes />
          </div>
        )}
      </div>

      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 font-bold">
            {profileInitial}
          </div>

          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white">{profileName}</p>
              <p className="truncate text-xs text-slate-400">{user?.email}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-red-300 disabled:opacity-50"
            aria-label="Sair da conta"
            title="Sair da conta"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
