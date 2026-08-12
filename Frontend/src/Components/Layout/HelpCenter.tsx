import {
  AlertCircle,
  Bot,
  Check,
  ChevronDown,
  CircleHelp,
  Copy,
  ExternalLink,
  FileSearch,
  Globe2,
  Laptop,
  LockKeyhole,
  Rocket,
  Search,
  Server,
  ShieldCheck,
  X,
} from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import {
  HELP_ARTICLES,
  HELP_CATEGORIES,
  type HelpArticle,
  type HelpCategory,
} from "./helpContent";

type HelpCenterProps = {
  initialQuery?: string;
  onClose: () => void;
};

type SelectedCategory = "todos" | HelpCategory;
type CategoryIcon = typeof CircleHelp;

const CATEGORY_ICONS: Record<SelectedCategory, CategoryIcon> = {
  todos: CircleHelp,
  inicio: Rocket,
  conexao: Server,
  modelos: Bot,
  recursos: FileSearch,
  seguranca: ShieldCheck,
};

const QUICK_START_STEPS = [
  {
    number: "01",
    title: "Escolha uma IA",
    description: "Abra Configurações e selecione o provedor e o modelo.",
  },
  {
    number: "02",
    title: "Teste a conexão",
    description: "Confirme que tudo está funcionando antes de salvar.",
  },
  {
    number: "03",
    title: "Inicie um chat",
    description: "Clique em Novo chat e conte ao assistente o que precisa.",
  },
] as const;

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function CodeLine({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function copyCommand() {
    try {
      await navigator.clipboard.writeText(command.replaceAll("  →  ", "\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-700/70 bg-slate-950 px-3 py-2.5">
      <code className="min-w-0 overflow-x-auto text-xs text-cyan-300 sm:text-sm">
        {command}
      </code>
      <button
        type="button"
        onClick={copyCommand}
        className="shrink-0 rounded-md p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-slate-200"
        aria-label={`Copiar comando: ${command}`}
      >
        {copied ? (
          <Check aria-hidden="true" className="text-emerald-400" size={15} />
        ) : (
          <Copy aria-hidden="true" size={15} />
        )}
      </button>
    </div>
  );
}

function HelpArticleCard({ article }: { article: HelpArticle }) {
  return (
    <details className="group overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 transition open:border-slate-700 open:bg-slate-900">
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-4 marker:hidden sm:px-5">
        <span className="min-w-0 flex-1 text-sm font-medium text-slate-100 sm:text-[15px]">
          {article.question}
        </span>
        {article.environment !== "all" ? (
          <span className="hidden rounded-full bg-slate-800 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:inline">
            {article.environment === "local" ? "Local" : "Online"}
          </span>
        ) : null}
        <span className="rounded-md bg-slate-800 p-1 text-slate-500 transition group-open:bg-cyan-500/10 group-open:text-cyan-300">
          <ChevronDown
            aria-hidden="true"
            className="transition-transform group-open:rotate-180"
            size={16}
          />
        </span>
      </summary>

      <div className="border-t border-slate-800 px-4 pb-5 pt-4 sm:px-5">
        <p className="text-sm leading-6 text-slate-300">{article.answer}</p>

        {article.steps ? (
          <ol className="mt-4 space-y-3">
            {article.steps.map((step, index) => (
              <li key={step} className="flex gap-3 text-sm leading-6 text-slate-400">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/5 text-[10px] font-bold text-cyan-300">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        ) : null}

        {article.commands ? (
          <div className="mt-4 space-y-2">
            {article.commands.map((command) => (
              <CodeLine key={command} command={command} />
            ))}
          </div>
        ) : null}

        {article.note ? (
          <div className="mt-4 flex gap-2 rounded-lg border border-amber-400/15 bg-amber-400/5 p-3 text-sm leading-5 text-amber-100/80">
            <AlertCircle
              aria-hidden="true"
              className="mt-0.5 shrink-0 text-amber-300"
              size={16}
            />
            <span>{article.note}</span>
          </div>
        ) : null}

        {article.link ? (
          <a
            href={article.link.href}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
          >
            {article.link.label}
            <ExternalLink aria-hidden="true" size={14} />
          </a>
        ) : null}
      </div>
    </details>
  );
}

function HelpCenter({ initialQuery = "", onClose }: HelpCenterProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory>("todos");
  const deferredQuery = useDeferredValue(query);
  const isLocal = ["localhost", "127.0.0.1"].includes(window.location.hostname);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    dialog.showModal();
    searchRef.current?.focus();

    return () => {
      if (dialog.open) {
        dialog.close();
      }
    };
  }, []);

  const filteredArticles = useMemo(() => {
    const normalizedQuery = normalizeText(deferredQuery.trim());

    return HELP_ARTICLES.filter((article) => {
      const matchesCategory =
        selectedCategory === "todos" || article.category === selectedCategory;

      if (!matchesCategory) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const searchableText = normalizeText(
        [
          article.question,
          article.answer,
          article.note ?? "",
          ...article.keywords,
          ...(article.steps ?? []),
        ].join(" "),
      );

      return searchableText.includes(normalizedQuery);
    });
  }, [deferredQuery, selectedCategory]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="help-center-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      style={{ width: "calc(100vw - 1rem)", maxWidth: "58rem" }}
      className="m-auto h-[min(88vh,760px)] overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 p-0 text-white shadow-[0_30px_100px_rgba(0,0,0,0.65)] backdrop:bg-slate-950/85"
    >
      <div className="flex h-full w-full min-w-0 flex-col">
        <header className="shrink-0 border-b border-slate-800 bg-slate-900 px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex items-start gap-3">
            <span className="rounded-xl bg-cyan-400/10 p-2.5 text-cyan-300 ring-1 ring-cyan-400/20">
              <CircleHelp aria-hidden="true" size={21} />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 id="help-center-title" className="text-lg font-semibold sm:text-xl">
                  Ajuda e suporte
                </h2>
                <span className="hidden items-center gap-1 rounded-full border border-slate-700 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:inline-flex">
                  {isLocal ? (
                    <Laptop aria-hidden="true" size={11} />
                  ) : (
                    <Globe2 aria-hidden="true" size={11} />
                  )}
                  {isLocal ? "Uso local" : "Versão online"}
                </span>
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-400 sm:text-sm">
                Pesquise uma dúvida ou escolha uma categoria.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar central de ajuda"
              className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
            >
              <X aria-hidden="true" size={20} />
            </button>
          </div>

          <label className="relative mt-4 block">
            <span className="sr-only">Pesquisar na central de ajuda</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              size={17}
            />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ex.: Ollama não conecta, chave inválida, chat bloqueado..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10"
            />
          </label>
        </header>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col md:flex-row">
          <aside className="shrink-0 border-b border-slate-800 bg-slate-900/50 p-3 md:w-52 md:border-b-0 md:border-r md:p-4">
            <p className="hidden px-2 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600 md:block">
              Categorias
            </p>
            <nav
              aria-label="Categorias da central de ajuda"
              className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible"
            >
              {HELP_CATEGORIES.map((category) => {
                const Icon = CATEGORY_ICONS[category.id];
                const articleCount =
                  category.id === "todos"
                    ? HELP_ARTICLES.length
                    : HELP_ARTICLES.filter((article) => article.category === category.id).length;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.id)}
                    aria-pressed={selectedCategory === category.id}
                    className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-medium transition md:w-full ${
                      selectedCategory === category.id
                        ? "bg-cyan-400/10 text-cyan-300 ring-1 ring-inset ring-cyan-400/20"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    }`}
                  >
                    <Icon aria-hidden="true" size={15} />
                    <span className="flex-1">{category.label}</span>
                    <span className="hidden text-[10px] text-slate-600 md:inline">{articleCount}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-6 hidden rounded-xl border border-slate-800 bg-slate-950 p-3 md:block">
              <p className="text-xs font-medium text-slate-300">Dica rápida</p>
              <p className="mt-1 text-[11px] leading-5 text-slate-500">
                Pesquise usando uma parte da mensagem de erro exibida na tela.
              </p>
            </div>
          </aside>

          <main className="min-h-0 min-w-0 flex-1 overflow-y-auto p-4 sm:p-5 md:p-6">
            {!query && selectedCategory === "todos" ? (
              <section aria-labelledby="quick-start-title" className="mb-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-300">
                      Guia rápido
                    </p>
                    <h3 id="quick-start-title" className="mt-1 text-base font-semibold text-white">
                      Comece por aqui
                    </h3>
                  </div>
                  <Rocket aria-hidden="true" className="text-slate-700" size={22} />
                </div>

                <ol className="mt-3 grid overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 sm:grid-cols-3">
                  {QUICK_START_STEPS.map((step) => (
                    <li
                      key={step.number}
                      className="border-b border-slate-800 p-4 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
                    >
                      <span className="text-[10px] font-bold tracking-wider text-cyan-300">
                        {step.number}
                      </span>
                      <p className="mt-1 text-sm font-medium text-slate-100">{step.title}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{step.description}</p>
                    </li>
                  ))}
                </ol>
              </section>
            ) : null}

            <section aria-labelledby="faq-title">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                    Respostas rápidas
                  </p>
                  <h3 id="faq-title" className="mt-1 text-base font-semibold text-white">
                    Dúvidas frequentes
                  </h3>
                </div>
                <p aria-live="polite" className="text-xs text-slate-600">
                  {filteredArticles.length} {filteredArticles.length === 1 ? "resultado" : "resultados"}
                </p>
              </div>

              {filteredArticles.length > 0 ? (
                <div className="mt-3 space-y-2.5">
                  {filteredArticles.map((article) => (
                    <HelpArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <div className="mt-3 rounded-xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-10 text-center">
                  <Search aria-hidden="true" className="mx-auto text-slate-600" size={25} />
                  <p className="mt-3 text-sm font-medium text-slate-200">
                    Não encontramos essa dúvida
                  </p>
                  <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
                    Tente palavras como “Ollama”, “conexão”, “chave”, “banco” ou “chat”.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setSelectedCategory("todos");
                      searchRef.current?.focus();
                    }}
                    className="mt-4 text-xs font-medium text-cyan-300 hover:text-cyan-200"
                  >
                    Limpar pesquisa
                  </button>
                </div>
              )}
            </section>

            <div className="mt-5 flex items-center gap-2 border-t border-slate-800 pt-4 text-[11px] text-slate-600">
              <LockKeyhole aria-hidden="true" size={13} />
              Nunca compartilhe senhas ou chaves de API.
            </div>
          </main>
        </div>
      </div>
    </dialog>
  );
}

export default HelpCenter;
