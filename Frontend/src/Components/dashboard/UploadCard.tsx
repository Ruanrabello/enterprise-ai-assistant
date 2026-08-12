import { Upload } from "lucide-react";

function UploadCard() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-900 p-6">
      <Upload
        size={48}
        className="text-cyan-400"
      />

      <h2 className="mt-4 text-xl font-semibold">
        Upload de documentos
      </h2>

      <p className="mt-2 text-center text-slate-400">
        Envie PDFs, Word ou Excel para que a IA analise e responda perguntas.
      </p>

      <button className="mt-6 rounded-lg bg-cyan-500 px-5 py-2 font-medium transition hover:bg-cyan-600">
        Selecionar arquivo
      </button>
    </div>
  );
}

export default UploadCard;
