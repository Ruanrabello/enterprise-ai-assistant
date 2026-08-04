import CardDash from "../Components/dashboard/CardDash";


function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <p className="text-gray-400 mt-2">
        Ben vindoa ao Dashboard.
      </p>

      <div className="grid grid-cols-3 gap-10 mt-15 text-center" >

        <CardDash
        title="Conversas"
        value={352}
        description="Conversas utilizadas"
        />

        <CardDash
        title="Documentos"
        value={42}
        description="Documentos enviados"
        />

        <CardDash
        title="Relatórios"
        value={2}
        description="Relatorios gerados"
        />

      </div>


    </div>
  );
}

export default Dashboard;
