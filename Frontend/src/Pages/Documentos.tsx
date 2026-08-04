import UploadCard from "../Components/dashboard/UploadCard";


function Documentos() {

  const documentos = [
    {
      nome:"Contrato.pdf",
      status:"Processado"
    },
    {
      nome:"Manual SAP.pdf",
      status:"Analisando"
    },
    {
      nome:"Relatório.xlsx",
      status:"Erro"
    }
  ];

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold">
        Documentos
      </h1>


      <div className="mt-6">
        <UploadCard />
      </div>


      <div className="mt-8 bg-slate-900 rounded-xl p-6">

        <h2 className="text-xl font-semibold mb-4">
          Documentos enviados
        </h2>


        <table className="w-full">

          <thead>
            <tr className="text-slate-400 text-left">
              <th>Nome</th>
              <th>Status</th>
            </tr>
          </thead>


          <tbody>

          {documentos.map((doc)=>(
            <tr key={doc.nome}
                className="border-t border-slate-800">

              <td className="py-3">
                {doc.nome}
              </td>

              <td>
                {doc.status}
              </td>

            </tr>
          ))}

          </tbody>

        </table>


      </div>


    </div>
  )
}


export default Documentos;
