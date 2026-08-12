import UploadCard from "../Components/dashboard/UploadCard";

const DOCUMENTOS_MOCK = [
  {
    nome: "Contrato.pdf",
    status: "Processado",
  },
  {
    nome: "Manual SAP.pdf",
    status: "Analisando",
  },
  {
    nome: "Relatório.xlsx",
    status: "Erro",
  },
] as const;

function getStatusStyles(status: string) {
  if (status === "Processado") {
    return "bg-emerald-500/10 text-emerald-300";
  }

  if (status === "Analisando") {
    return "bg-amber-500/10 text-amber-300";
  }

  return "bg-rose-500/10 text-rose-300";
}

function Documentos() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Documentos</h1>

      <p className="mt-2 text-slate-400">
        Centralize uploads e acompanhe o processamento dos arquivos.
      </p>

      <div className="mt-6">
        <UploadCard />
      </div>

      <div className="mt-8 rounded-xl bg-slate-900 p-6">
        <h2 className="mb-4 text-xl font-semibold">Documentos enviados</h2>

        <table className="w-full">
          <thead>
            <tr className="text-left text-slate-400">
              <th>Nome</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {DOCUMENTOS_MOCK.map((documento) => (
              <tr
                key={documento.nome}
                className="border-t border-slate-800"
              >
                <td className="py-3">{documento.nome}</td>

                <td className="py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyles(documento.status)}`}
                  >
                    {documento.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Documentos;
