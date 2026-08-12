import CardDash from "../Components/dashboard/CardDash";

const DASHBOARD_CARDS = [
  {
    title: "Conversas",
    value: 352,
    description: "Conversas realizadas",
  },
  {
    title: "Documentos",
    value: 42,
    description: "Documentos enviados",
  },
  {
    title: "Relatórios",
    value: 2,
    description: "Relatórios gerados",
  },
] as const;

function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <p className="mt-2 text-slate-400">
        Bem-vindo ao painel principal do seu assistente.
      </p>

      <div className="mt-10 grid gap-6 text-center md:grid-cols-3">
        {DASHBOARD_CARDS.map((card) => (
          <CardDash
            key={card.title}
            title={card.title}
            value={card.value}
            description={card.description}
          />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
