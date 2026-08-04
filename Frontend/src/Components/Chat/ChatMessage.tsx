/* Esse componente representa uma mensagem. */
import { Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MensagemChatPropriedades = {
    texto: string;
    usuario: "user" | "ai";
    modelo?: string | null;
};

function MensagemChat({texto, usuario, modelo}: MensagemChatPropriedades) {

    const isUser = usuario === "user";

    if (isUser) {
        return (
            <div className="flex justify-end">
                <div className="
                    max-w-[70%]
                    rounded-xl
                    px-4
                    py-3
                    bg-cyan-500
                    text-white
                ">
                    {texto}
                </div>
            </div>
        );
    }

    return (
        <div className="flex gap-3 items-start">
            <div className="
                h-8
                w-8
                shrink-0
                rounded-full
                bg-slate-700
                flex
                items-center
                justify-center
            ">
                <Bot size={18} className="text-cyan-400" />
            </div>

            <div className="
                max-w-[70%]
                text-slate-200
                leading-relaxed
                pt-1
                [&_p]:mb-3
                [&_p:last-child]:mb-0
                [&_ul]:list-disc
                [&_ul]:pl-5
                [&_ul]:mb-3
                [&_ul]:space-y-1
                [&_ol]:list-decimal
                [&_ol]:pl-5
                [&_ol]:mb-3
                [&_ol]:space-y-1
                [&_li]:pl-1
                [&_h1]:text-xl
                [&_h1]:font-bold
                [&_h1]:mt-4
                [&_h1]:mb-2
                [&_h2]:text-lg
                [&_h2]:font-bold
                [&_h2]:mt-4
                [&_h2]:mb-2
                [&_h3]:text-base
                [&_h3]:font-semibold
                [&_h3]:mt-3
                [&_h3]:mb-2
                [&_strong]:font-semibold
                [&_strong]:text-white
                [&_em]:italic
                [&_hr]:border-slate-700
                [&_hr]:my-4
                [&_code]:bg-slate-800
                [&_code]:px-1.5
                [&_code]:py-0.5
                [&_code]:rounded
                [&_code]:text-sm
                [&_code]:text-cyan-300
                [&_table]:w-full
                [&_table]:my-3
                [&_table]:border-collapse
                [&_th]:border
                [&_th]:border-slate-700
                [&_th]:bg-slate-800
                [&_th]:px-3
                [&_th]:py-2
                [&_th]:text-left
                [&_td]:border
                [&_td]:border-slate-700
                [&_td]:px-3
                [&_td]:py-2
            ">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{texto}</ReactMarkdown>

                {modelo && (
                    <p className="text-xs text-slate-500 mt-2">
                        {modelo}
                    </p>
                )}
            </div>
        </div>
    );
}

export default MensagemChat
