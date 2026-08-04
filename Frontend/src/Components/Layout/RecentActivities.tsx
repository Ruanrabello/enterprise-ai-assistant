import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../Services/api";
import type { Conversa } from "../../types/conversa";


function ConversasRecentes() {

    const [conversas, setConversas] = useState<Conversa[]>([])

    const location = useLocation();

    useEffect(() => {

        let ativo = true;

        async function carregarConversas() {

            try {
                const response = await api.get("/chat/conversas");

                if(ativo){
                    setConversas(response.data);
                }



            }catch(error){
                console.error(error);

            }

        }

        carregarConversas();
        return () => {
            ativo = false;
        };


    }, [location.pathname]);



    return(
        <div className="
            flex
            flex-col
            rounded-xl
            border
            border-slate-800
            bg-slate-900
            p-4
        ">

            <h2 className="
                text-sm
                font-semibold
                text-white
                mb-4
            ">
                Conversas Recentes
            </h2>


            <div className="
                flex-1
                overflow-y-auto
                pr-2
                space-y-1
            ">

                {conversas.map((conversa) => (

                    <NavLink
                        key={conversa.id}
                        to={`/chat/${conversa.id}`}
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-md
                            p-2
                            hover:bg-slate-800
                            cursor-pointer
                            transition
                        "
                    >

                        <div className="
                            h-2
                            w-2
                            rounded-full
                            bg-cyan-400
                        ">
                        </div>


                        <p className="
                            text-sm
                            text-slate-300
                            truncate
                        ">
                            {conversa.titulo}
                        </p>


                    </NavLink>

                ))}

            </div>

        </div>
    );
}


export default ConversasRecentes;
