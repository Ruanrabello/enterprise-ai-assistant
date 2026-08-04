import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import api from "../../Services/api";
import { useNavigate } from "react-router-dom";

import { NavLink } from "react-router-dom";

import ConversasRecentes from "./RecentActivities";



interface Sidebar_Estado_Minimizado_Cheia {
  collapsed: boolean;
  onToggle: () => void;
}

function Sidebar({ collapsed, onToggle }: Sidebar_Estado_Minimizado_Cheia) {
  const navigate = useNavigate();

  async function CriarNovaConversa() {
    try {

      const response = await api.post("/chat/conversas",{
        titulo: "Nova conversa"                               /*Preciso mecher nisso depois para o titulo que ser automatico gerado pela ia */
      });

      const conversa = response.data;

      navigate(`/chat/${conversa.id}`);
     }catch(error){

    console.error("Erro ao criar conversa", error);

    }
  }

  const menu = [

    {
      icon: MessageSquare,
      label: "New Chat",
      action: CriarNovaConversa
    },

    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/"
    },

    {
      icon: BarChart3,
      label: "Relatórios",
      path: "/relatorio"
    },

    {
      icon: FileText,
      label: "Documentos",
      path: "/documents"
    },

    {
      icon: Settings,
      label: "Configurações",
      path: "/settings"
    },

  ];


  return (

    <aside
      className={`
        ${collapsed ? "w-20" : "w-75"}
        bg-slate-900
        h-screen
        border-r
        border-slate-800
        p-1.5
        flex
        flex-col
        transition-all
        duration-300
      `}
    >

      <div className="flex items-center justify-between">
        <div>
          {!collapsed ? (
            <div className="rounded-lg pl-2 pr-3 py-3">
              <img
                src="public/logo.png"
                alt="Logo"
                className="w-18 h-14 object-contain -ml-4"
              />
            </div>
          ) : (
            <div className="p-3 flex items-center justify-center">
              <img
                src="public/logo.png"
                alt="Logo"
                className="w-6 h-6 object-contain"
              />
            </div>
          )}
        </div>

        <div className="p-3">
          <button
            onClick={onToggle}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-300"
          >
            {collapsed ? <ChevronRight size={18}/> : <ChevronLeft size={18}/>}
          </button>
        </div>
      </div>


      <nav className="mt-10 space-y-2">

        {menu.map(({ icon: Icon, label, path, action }) => (

          action ? (

            <button
              key={label}
              onClick={action}
              className="
                flex
                items-center
                gap-3
                rounded-lg
                p-3
                transition
                hover:bg-slate-800
                text-slate-300
                w-full
              "
            >

              <Icon size={15}/>

              {!collapsed && (
                <span>{label}</span>
              )}

            </button>


          ) : (


            <NavLink
              key={label}
              to={path!}
              className={({isActive}) =>
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
                  : "hover:bg-slate-800 text-slate-300"
                }
                `
              }
            >

              <Icon size={15}/>

              {!collapsed && (
                <span>{label}</span>
              )}

            </NavLink>


          )

        ))}

      </nav>


      <div
        className="
          flex-1
          overflow-hidden
          pt-6
          px-3
        "
      >

        {!collapsed && (
          <div className="h-full overflow-y-auto">
            <ConversasRecentes />
          </div>
        )}

      </div>


      <div className="p-6 border-t border-slate-800">

        <div className="flex items-center gap-3">

          <div className="h-8 w-8 rounded-full bg-cyan-500 flex items-center justify-center font-bold">
            R
          </div>

          {!collapsed && (
            <div>
              <p className="text-sm text-white font-medium">
                Ruan
              </p>

              <p className="text-xs text-slate-400">
                Plano Free
              </p>
            </div>
          )}

        </div>

      </div>


    </aside>

  );
}

export default Sidebar;







