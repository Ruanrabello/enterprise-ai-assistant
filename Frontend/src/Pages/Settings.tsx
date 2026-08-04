import { useEffect, useState } from "react";
import api from "../Services/api";

type Provider = "ollama" | "gemini" | "grok";

const MODELOS: Record<Provider, string[]> = {
  ollama: ["qwen3:8b", "gemma4:latest", "llama3.3", "deepseek-r1"],
  gemini: ["gemini-2.5-flash", "gemini-2.5-pro"],
  grok: ["grok-4"],
};

const COMANDOS_INSTALACAO: Record<string, string> = {
  "qwen3:8b": "ollama pull qwen3:8b",
  "gemma4:latest": "ollama pull gemma4",
  "llama3.3": "ollama pull llama3.3",
  "deepseek-r1": "ollama pull deepseek-r1",
};

function Configurações() {
  const [provider, setProvider] = useState<Provider>("ollama");
  const [modelo, setModelo] = useState<string>(MODELOS["ollama"][0]);
  const [apiKey, setApiKey] = useState<string>("");
  const [salvando, setSalvando] = useState(false);
  const [statusTeste, setStatusTeste] = useState<"idle" | "testando" | "ok" | "erro">("idle");

  useEffect(() => {
    async function carregarConfig() {
      try {
        const response = await api.get("/configuracoes/ia");
        if (response.data) {
          setProvider(response.data.provider);
          setModelo(response.data.modelo);
          setApiKey(response.data.api_key ?? "");
        }
      } catch (error) {
        console.error(error);
      }
    }
    carregarConfig();
  }, []);

  function aoTrocarProvider(novoProvider: Provider) {
    setProvider(novoProvider);
    setModelo(MODELOS[novoProvider][0]);
    setApiKey("");
    setStatusTeste("idle");
  }

  async function salvarConfiguracao() {
    setSalvando(true);
    try {
      await api.put("/configuracoes/ia", {
        provider,
        modelo,
        api_key: apiKey || null,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSalvando(false);
    }
  }

  async function testarConexao() {
  setStatusTeste("testando");
  try {
    await api.post("/configuracoes/ia/testar", {
      provider,
      modelo,
      api_key: apiKey || null,
    });
    setStatusTeste("ok");
  } catch (error) {
    console.error(error);
    setStatusTeste("erro");
  }
}

  return (
    <div className="max-w-4xl">

      <h1 className="text-3xl font-bold">
        Configurações
      </h1>

      <p className="text-slate-400 mt-2">
        Gerencie as configurações do seu assistente de IA.
      </p>

      {/* Perfil */}
      <div className="mt-10 rounded-xl border border-slate-800 bg-slate-900 p-6">

        <h2 className="text-xl font-semibold">
          👤 Perfil
        </h2>

        <div className="mt-5">

          <label className="text-sm text-slate-400">
            Nome
          </label>

          <input
            type="text"
            placeholder="Seu nome"
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-500"
          />

        </div>

      </div>

      {/* IA */}

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6">

        <h2 className="text-xl font-semibold">
          🤖 Inteligência Artificial
        </h2>

        <div className="mt-5">
          <label className="text-sm text-slate-400">
            Fornecedor
          </label>

          <div className="mt-2 grid grid-cols-3 gap-3">
            {(["ollama", "gemini", "grok"] as Provider[]).map((p) => (
              <button
                key={p}
                onClick={() => aoTrocarProvider(p)}
                className={`
                  rounded-lg border px-4 py-3 text-sm font-medium transition
                  ${provider === p
                    ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                    : "border-slate-700 text-slate-300 hover:bg-slate-800"}
                `}
              >
                {p === "ollama" && "Ollama (Local)"}
                {p === "gemini" && "Gemini"}
                {p === "grok" && "Grok"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <label className="text-sm text-slate-400">
            Modelo
          </label>

          <select
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3"
          >
            {MODELOS[provider].map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {provider === "ollama" && (
          <div className="mt-5 rounded-lg border border-slate-800 bg-slate-950 p-4">
            <p className="text-sm text-slate-400">
              Modelos locais precisam estar instalados no Ollama antes de usar.
            </p>
            <pre className="mt-2 rounded-md bg-slate-900 px-3 py-2 text-sm text-cyan-300 overflow-x-auto">
              {COMANDOS_INSTALACAO[modelo] ?? `ollama pull ${modelo}`}
            </pre>
          </div>
        )}

        {(provider === "gemini" || provider === "grok") && (
          <div className="mt-5">
            <label className="text-sm text-slate-400">
              API Key
            </label>

            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Cole sua chave de API"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-500"
            />
          </div>
        )}

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={testarConexao}
            disabled={statusTeste === "testando"}
            className="rounded-lg border border-slate-700 px-5 py-3 font-medium hover:bg-slate-800 transition disabled:opacity-50"
          >
            {statusTeste === "testando" ? "Testando..." : "Testar conexão"}
          </button>

          {statusTeste === "ok" && (
            <span className="text-sm text-green-400">🟢 Conectado</span>
          )}
          {statusTeste === "erro" && (
            <span className="text-sm text-red-400">🔴 Falha na conexão</span>
          )}

          <button
            onClick={salvarConfiguracao}
            disabled={salvando}
            className="ml-auto rounded-lg bg-cyan-500 px-5 py-3 font-medium hover:bg-cyan-600 transition disabled:opacity-50"
          >
            {salvando ? "Salvando..." : "Salvar"}
          </button>
        </div>

      </div>

      {/* Documentos */}

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6">

        <h2 className="text-xl font-semibold">
          📄 Documentos
        </h2>

        <div className="mt-5">

          <label className="text-sm text-slate-400">
            Tamanho máximo
          </label>

          <input
            type="number"
            defaultValue={20}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3"
          />

        </div>

        <div className="mt-5">

          <label className="text-sm text-slate-400">
            Formatos permitidos
          </label>

          <input
            type="text"
            defaultValue="PDF, DOCX, XLSX"
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3"
          />

        </div>

      </div>

    </div>
  );
}

export default Configurações;
