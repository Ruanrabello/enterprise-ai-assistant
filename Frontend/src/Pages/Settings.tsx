import axios from "axios";
import { useEffect, useState } from "react";
import { PROVIDER_LABELS, PROVIDER_MODELS, PROVIDERS } from "../constants/ai";
import api from "../Services/api";
import type {
  AIConfigurationResponse,
  ConnectionStatus,
  ProfileResponse,
  Provider,
  RequestStatus,
} from "../types/settings";

function SettingsPage() {
  const [nome, setNome] = useState("");
  const [statusPerfil, setStatusPerfil] = useState<RequestStatus>("idle");
  const [provider, setProvider] = useState<Provider>("ollama");
  const [modelo, setModelo] = useState(PROVIDER_MODELS.ollama[0]);
  const [apiKey, setApiKey] = useState("");
  const [providerSalvo, setProviderSalvo] = useState<Provider | null>(null);
  const [possuiApiKey, setPossuiApiKey] = useState(false);
  const [statusSalvamento, setStatusSalvamento] = useState<RequestStatus>("idle");
  const [mensagemSalvamento, setMensagemSalvamento] = useState("");
  const [statusTeste, setStatusTeste] = useState<ConnectionStatus>("idle");
  const [mensagemTeste, setMensagemTeste] = useState("");

  function limparResultadoTeste() {
    setStatusTeste("idle");
    setMensagemTeste("");
  }

  useEffect(() => {
    async function carregarConfiguracoes() {
      try {
        const perfilResponse = await api.get<ProfileResponse>("/configuracoes/perfil");
        setNome(perfilResponse.data.nome);
      } catch (error) {
        console.error(error);
      }

      try {
        const configuracaoResponse = await api.get<AIConfigurationResponse | null>("/configuracoes/ia");

        if (configuracaoResponse.data) {
          setProvider(configuracaoResponse.data.provider);
          setProviderSalvo(configuracaoResponse.data.provider);
          setModelo(configuracaoResponse.data.modelo);
          setPossuiApiKey(configuracaoResponse.data.possui_api_key);
        }
      } catch (error) {
        console.error(error);
      }
    }

    void carregarConfiguracoes();
  }, []);

  async function salvarPerfil() {
    const nomeNormalizado = nome.trim().replace(/\s+/g, " ");

    if (nomeNormalizado.length < 2) {
      setStatusPerfil("error");
      return;
    }

    setStatusPerfil("saving");

    try {
      const response = await api.put<ProfileResponse>("/configuracoes/perfil", {
        nome: nomeNormalizado,
      });

      setNome(response.data.nome);
      setStatusPerfil("success");
      window.dispatchEvent(
        new CustomEvent("perfil-atualizado", {
          detail: { nome: response.data.nome },
        }),
      );
    } catch (error) {
      console.error(error);
      setStatusPerfil("error");
    }
  }

  function trocarProvider(novoProvider: Provider) {
    setProvider(novoProvider);
    setModelo(PROVIDER_MODELS[novoProvider][0]);
    setApiKey("");
    limparResultadoTeste();
  }

  async function salvarConfiguracao() {
    limparResultadoTeste();

    if (provider !== "ollama" && provider !== providerSalvo && !apiKey.trim()) {
      setStatusSalvamento("error");
      setMensagemSalvamento(`Informe a API key do provedor ${PROVIDER_LABELS[provider]}.`);
      return;
    }

    setStatusSalvamento("saving");
    setMensagemSalvamento("");

    try {
      const response = await api.put<AIConfigurationResponse>("/configuracoes/ia", {
        provider,
        modelo,
        api_key: apiKey.trim() || null,
      });

      setProviderSalvo(provider);
      setPossuiApiKey(response.data.possui_api_key);
      setApiKey("");
      setStatusSalvamento("success");
      setMensagemSalvamento("Configuração salva.");
    } catch (error) {
      console.error(error);
      setStatusSalvamento("error");
      setMensagemSalvamento("Não foi possível salvar a configuração.");
    }
  }

  async function testarConexao() {
    setStatusTeste("testing");
    setMensagemTeste("");

    try {
      const response = await api.post<{ status: string; mensagem: string }>(
        "/configuracoes/ia/testar",
        {
          provider,
          modelo,
          api_key: apiKey.trim() || null,
        },
        {
          timeout: 90000,
        },
      );

      setStatusTeste("success");
      setMensagemTeste(response.data.mensagem);
    } catch (error) {
      console.error(error);
      setStatusTeste("error");

      if (axios.isAxiosError(error)) {
        const backendDetail = error.response?.data?.detail;

        if (typeof backendDetail === "string" && backendDetail.trim()) {
          setMensagemTeste(backendDetail);
          return;
        }

        if (error.code === "ECONNABORTED") {
          setMensagemTeste("A requisição demorou demais para responder. Tente novamente ou use um modelo mais leve.");
          return;
        }
      }

      setMensagemTeste("Não foi possível testar a conexão com o provedor selecionado.");
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold">Configurações</h1>

      <p className="mt-2 text-slate-400">
        Gerencie as preferências do seu assistente e os provedores de IA.
      </p>

      <div className="mt-10 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">Perfil</h2>

        <div className="mt-5">
          <label className="text-sm text-slate-400">Nome</label>

          <input
            type="text"
            value={nome}
            onChange={(event) => {
              setNome(event.target.value);
              setStatusPerfil("idle");
            }}
            placeholder="Seu nome"
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-500"
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={salvarPerfil}
            disabled={statusPerfil === "saving"}
            className="rounded-lg bg-cyan-500 px-5 py-3 font-medium transition hover:bg-cyan-600 disabled:opacity-50"
          >
            {statusPerfil === "saving" ? "Salvando..." : "Salvar perfil"}
          </button>

          {statusPerfil === "success" && (
            <span className="text-sm text-green-400">Perfil salvo</span>
          )}

          {statusPerfil === "error" && (
            <span className="text-sm text-red-400">Informe um nome válido</span>
          )}
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">Inteligência artificial</h2>

        <div className="mt-5">
          <label className="text-sm text-slate-400">Fornecedor</label>

          <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-3">
            {PROVIDERS.map((providerOption) => (
              <button
                key={providerOption}
                onClick={() => trocarProvider(providerOption)}
                className={`
                  rounded-lg border px-4 py-3 text-sm font-medium transition
                  ${
                    provider === providerOption
                      ? "border-cyan-500 bg-cyan-500/10 text-cyan-400"
                      : "border-slate-700 text-slate-300 hover:bg-slate-800"
                  }
                `}
              >
                {PROVIDER_LABELS[providerOption]}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <label className="text-sm text-slate-400">Modelo</label>

          <select
            value={modelo}
            onChange={(event) => {
              setModelo(event.target.value);
              limparResultadoTeste();
            }}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3"
          >
            {PROVIDER_MODELS[provider].map((modelOption) => (
              <option key={modelOption} value={modelOption}>
                {modelOption}
              </option>
            ))}
          </select>
        </div>

        {provider === "ollama" && (
          <div className="mt-5 rounded-lg border border-slate-800 bg-slate-950 p-4">
            <p className="text-sm text-slate-400">
              Modelos locais precisam estar instalados no Ollama antes de usar.
            </p>

            <pre className="mt-2 overflow-x-auto rounded-md bg-slate-900 px-3 py-2 text-sm text-cyan-300">
              {`ollama pull ${modelo}`}
            </pre>
          </div>
        )}

        {provider !== "ollama" && (
          <div className="mt-5">
            <label className="text-sm text-slate-400">API key</label>

            <input
              type="password"
              value={apiKey}
              onChange={(event) => {
                setApiKey(event.target.value);
                limparResultadoTeste();
              }}
              placeholder="Cole sua chave de API"
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-500"
            />

            {possuiApiKey && provider === providerSalvo && !apiKey && (
              <p className="mt-2 text-xs text-green-400">
                Já existe uma chave configurada. Digite outra apenas para substituí-la.
              </p>
            )}
          </div>
        )}

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={testarConexao}
            disabled={statusTeste === "testing"}
            className="rounded-lg border border-slate-700 px-5 py-3 font-medium transition hover:bg-slate-800 disabled:opacity-50"
          >
            {statusTeste === "testing" ? "Testando..." : "Testar conexão"}
          </button>

          {statusTeste === "success" && (
            <span className="text-sm text-green-400">Conectado</span>
          )}

          {statusTeste === "error" && (
            <span className="text-sm text-red-400">Falha na conexão</span>
          )}

          <button
            onClick={salvarConfiguracao}
            disabled={statusSalvamento === "saving"}
            className="ml-auto rounded-lg bg-cyan-500 px-5 py-3 font-medium transition hover:bg-cyan-600 disabled:opacity-50"
          >
            {statusSalvamento === "saving" ? "Salvando..." : "Salvar"}
          </button>
        </div>

        {mensagemTeste && (
          <p
            className={`mt-3 text-sm ${
              statusTeste === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {mensagemTeste}
          </p>
        )}

        {mensagemSalvamento && (
          <p
            className={`mt-3 text-sm ${
              statusSalvamento === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {mensagemSalvamento}
          </p>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold">Documentos</h2>

        <div className="mt-5">
          <label className="text-sm text-slate-400">Tamanho máximo</label>

          <input
            type="number"
            defaultValue={20}
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3"
          />
        </div>

        <div className="mt-5">
          <label className="text-sm text-slate-400">Formatos permitidos</label>

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

export default SettingsPage;
