import { Eye, EyeOff, LoaderCircle, LockKeyhole, Sparkles } from "lucide-react";
import { useState, type SubmitEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/auth-context";
import { supabase } from "../Services/supabase";

type LoginLocationState = {
  from?: {
    pathname?: string;
    search?: string;
  };
};

function traduzirErroAutenticacao(message: string) {
  const mensagem = message.toLowerCase();

  if (mensagem.includes("invalid login credentials")) {
    return "E-mail ou senha incorretos.";
  }

  if (mensagem.includes("email not confirmed")) {
    return "Confirme seu e-mail antes de entrar. Verifique também a caixa de spam.";
  }

  if (mensagem.includes("user already registered")) {
    return "Este e-mail já possui uma conta. Tente entrar.";
  }

  if (mensagem.includes("signup is disabled")) {
    return "Novos cadastros estão temporariamente desativados.";
  }

  if (mensagem.includes("password") && mensagem.includes("characters")) {
    return "A senha não atende aos requisitos mínimos de segurança.";
  }

  if (mensagem.includes("rate limit") || mensagem.includes("too many requests")) {
    return "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.";
  }

  return "Não foi possível concluir a autenticação. Confira os dados e tente novamente.";
}

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loading: carregandoSessao, user } = useAuth();
  const routeState = location.state as LoginLocationState | null;
  const destino = `${routeState?.from?.pathname ?? "/"}${routeState?.from?.search ?? ""}`;

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [modoCadastro, setModoCadastro] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  if (carregandoSessao) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
        <div className="flex items-center gap-3" role="status">
          <LoaderCircle className="animate-spin text-cyan-400" size={22} />
          <span>Verificando sua sessão...</span>
        </div>
      </main>
    );
  }

  if (user) {
    return <Navigate to={destino} replace />;
  }

  async function enviarFormulario(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setCarregando(true);
    setErro("");
    setMensagem("");

    try {
      if (modoCadastro) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: senha,
          options: {
            data: { nome: nome.trim() },
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) {
          throw error;
        }

        if (data.session) {
          navigate(destino, { replace: true });
        } else {
          setMensagem(
            "Cadastro realizado. Abra o link enviado ao seu e-mail para confirmar a conta.",
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: senha,
        });

        if (error) {
          throw error;
        }

        navigate(destino, { replace: true });
      }
    } catch (error) {
      setErro(
        error instanceof Error
          ? traduzirErroAutenticacao(error.message)
          : "Ocorreu um erro durante a autenticação.",
      );
    } finally {
      setCarregando(false);
    }
  }

  function alternarModo() {
    setModoCadastro((modoAtual) => !modoAtual);
    setErro("");
    setMensagem("");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(6,182,212,0.14),_transparent_42%)]" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
            <Sparkles size={24} aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold text-white">Enterprise AI</h1>
          <p className="mt-2 text-slate-400">
            {modoCadastro
              ? "Crie sua conta para começar"
              : "Entre na sua conta para continuar"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-7 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
          <form onSubmit={enviarFormulario} className="space-y-5">
            {modoCadastro ? (
              <div>
                <label htmlFor="nome" className="mb-2 block text-sm font-medium text-slate-300">
                  Nome
                </label>
                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  autoComplete="name"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10"
                  placeholder="Seu nome"
                />
              </div>
            ) : null}

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-300">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                inputMode="email"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10"
                placeholder="voce@email.com"
              />
            </div>

            <div>
              <label htmlFor="senha" className="mb-2 block text-sm font-medium text-slate-300">
                Senha
              </label>
              <div className="relative">
                <LockKeyhole
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600"
                  size={17}
                  aria-hidden="true"
                />
                <input
                  id="senha"
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  autoComplete={modoCadastro ? "new-password" : "current-password"}
                  required
                  minLength={6}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 py-3 pl-11 pr-12 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10"
                  placeholder="Mínimo de 6 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((valorAtual) => !valorAtual)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-slate-300"
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {mostrarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div aria-live="polite">
              {erro ? (
                <div className="rounded-lg border border-red-900 bg-red-950/50 p-3 text-sm text-red-300">
                  {erro}
                </div>
              ) : null}

              {mensagem ? (
                <div className="rounded-lg border border-emerald-900 bg-emerald-950/50 p-3 text-sm leading-6 text-emerald-300">
                  {mensagem}
                </div>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando ? <LoaderCircle className="animate-spin" size={18} /> : null}
              {carregando ? "Aguarde..." : modoCadastro ? "Criar conta" : "Entrar"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            {modoCadastro ? "Já possui uma conta?" : "Ainda não possui uma conta?"}
            <button
              type="button"
              onClick={alternarModo}
              className="ml-2 font-medium text-cyan-400 transition hover:text-cyan-300"
            >
              {modoCadastro ? "Entrar" : "Criar conta"}
            </button>
          </div>
        </div>

        <p className="mt-5 text-center text-xs leading-5 text-slate-500">
          Sua sessão é protegida pelo Supabase e permanece ativa neste dispositivo.
        </p>
      </div>
    </main>
  );
}

export default Login;
