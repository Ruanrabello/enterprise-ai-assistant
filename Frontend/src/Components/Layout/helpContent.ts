export type HelpCategory =
  | "inicio"
  | "conexao"
  | "modelos"
  | "recursos"
  | "seguranca";

export type HelpEnvironment = "all" | "local" | "online";

export type HelpArticle = {
  id: string;
  category: HelpCategory;
  environment: HelpEnvironment;
  question: string;
  answer: string;
  steps?: readonly string[];
  commands?: readonly string[];
  note?: string;
  link?: {
    label: string;
    href: string;
  };
  keywords: readonly string[];
};

export const HELP_CATEGORIES: readonly {
  id: "todos" | HelpCategory;
  label: string;
}[] = [
  { id: "todos", label: "Todos" },
  { id: "inicio", label: "Primeiros passos" },
  { id: "conexao", label: "Conexão" },
  { id: "modelos", label: "Modelos de IA" },
  { id: "recursos", label: "Recursos" },
  { id: "seguranca", label: "Conta e segurança" },
] as const;

export const HELP_ARTICLES: readonly HelpArticle[] = [
  {
    id: "primeiro-acesso-local",
    category: "inicio",
    environment: "local",
    question: "Como iniciar a aplicação no meu computador?",
    answer:
      "A versão do GitHub possui três partes independentes: backend, frontend e o provedor de IA. Mantenha cada processo aberto em seu próprio terminal.",
    steps: [
      "Preencha o arquivo .env com a conexão do banco e as chaves necessárias.",
      "Na pasta Backend/App, inicie a API.",
      "Na pasta Frontend, inicie a interface.",
      "Se escolher Ollama, abra também o aplicativo Ollama antes de testar.",
      "Acesse Configurações, escolha o modelo, teste a conexão e salve.",
    ],
    commands: [
      "cd Backend/App  →  uvicorn main:app --reload",
      "cd Frontend  →  npm install  →  npm run dev",
    ],
    keywords: ["instalar", "iniciar", "github", "terminal", "rodar", "primeiro acesso"],
  },
  {
    id: "primeiro-acesso-online",
    category: "inicio",
    environment: "online",
    question: "Como começar a usar a versão online?",
    answer:
      "Na versão publicada, você não precisa iniciar terminais. Abra Configurações, escolha um provedor disponível, informe a chave quando solicitada, teste e salve.",
    steps: [
      "Abra Configurações no menu lateral.",
      "Escolha o fornecedor e o modelo de IA.",
      "Informe a chave de API, quando necessária.",
      "Use Testar conexão e depois Salvar.",
      "Crie um Novo chat para começar.",
    ],
    note:
      "O Ollama executado no seu computador não fica automaticamente acessível para um servidor hospedado. No uso online, selecione um provedor por API.",
    keywords: ["online", "render", "começar", "configurar", "primeiro acesso"],
  },
  {
    id: "backend-indisponivel",
    category: "conexao",
    environment: "local",
    question: "A página abre, mas não carrega dados ou não cria chats",
    answer:
      "O frontend pode estar aberto enquanto a API está desligada. Nesse caso, a tela aparece normalmente, mas as ações que dependem do banco falham.",
    steps: [
      "Abra um novo terminal na pasta Backend/App.",
      "Inicie o FastAPI e mantenha o terminal aberto.",
      "Acesse 127.0.0.1:8000/docs para confirmar que a API respondeu.",
      "Atualize a página da aplicação e tente novamente.",
    ],
    commands: ["uvicorn main:app --reload"],
    link: { label: "Abrir documentação local da API", href: "http://127.0.0.1:8000/docs" },
    keywords: ["backend", "api", "network error", "não carrega", "chat", "8000"],
  },
  {
    id: "render-acordando",
    category: "conexao",
    environment: "online",
    question: "A versão online demora ou falha na primeira tentativa",
    answer:
      "Em alguns planos de hospedagem, o servidor pode entrar em repouso quando fica sem uso. A primeira solicitação precisa acordá-lo e pode demorar mais que as seguintes.",
    steps: [
      "Aguarde de 30 a 90 segundos sem fechar a página.",
      "Tente a ação novamente uma única vez.",
      "Se continuar falhando, atualize a página e verifique sua conexão com a internet.",
      "Se outras páginas funcionarem, mas a IA não, teste o provedor em Configurações.",
    ],
    note:
      "Uma espera apenas na primeira ação costuma indicar inicialização do servidor. Falhas contínuas precisam ser verificadas pelo responsável pela aplicação.",
    keywords: ["render", "online", "demora", "lento", "cold start", "acordar", "timeout"],
  },
  {
    id: "cors-ou-url-api",
    category: "conexao",
    environment: "all",
    question: "Aparece Network Error, Failed to fetch ou erro de CORS",
    answer:
      "Essas mensagens normalmente significam que a interface não conseguiu falar com o backend correto ou que o endereço da interface ainda não foi autorizado pela API.",
    steps: [
      "No uso local, confirme que frontend e backend estão ativos.",
      "Confira se VITE_API_URL aponta para o endereço real do backend.",
      "No deploy, confira se FRONTEND_ORIGINS contém exatamente o domínio da interface, incluindo https://.",
      "Reinicie ou publique novamente o serviço depois de alterar variáveis de ambiente.",
    ],
    note:
      "Essa configuração é feita por quem instalou ou publicou o projeto. O usuário final não precisa alterar o navegador.",
    keywords: ["cors", "network", "failed to fetch", "vite api url", "frontend origins", "deploy"],
  },
  {
    id: "banco-dados",
    category: "conexao",
    environment: "all",
    question: "O backend não inicia ou mostra erro de banco de dados",
    answer:
      "A API precisa encontrar uma DATABASE_URL válida e alcançar o banco de dados configurado.",
    steps: [
      "Confirme que existe um arquivo .env local ou uma variável DATABASE_URL no serviço hospedado.",
      "Revise usuário, senha, host, porta e nome do banco.",
      "Se a senha tiver caracteres especiais, use uma URL corretamente codificada.",
      "Confirme no Supabase se o projeto está ativo e aceita conexões.",
      "Reinicie o backend após corrigir a variável.",
    ],
    note: "Nunca publique a DATABASE_URL real no GitHub.",
    keywords: ["database", "postgres", "supabase", "database_url", "banco", "backend não inicia"],
  },
  {
    id: "ollama-10061",
    category: "modelos",
    environment: "local",
    question: "Ollama: falha na conexão ou erro 10061",
    answer:
      "O modelo pode estar instalado, mas o servidor do Ollama está desligado. O erro 10061 significa que não havia nenhum serviço aceitando a conexão na porta local do Ollama.",
    steps: [
      "Abra o aplicativo Ollama pelo menu Iniciar.",
      "Se necessário, abra um terminal e inicie o servidor manualmente.",
      "Verifique se localhost:11434/api/tags exibe uma lista em formato JSON.",
      "Volte às Configurações da aplicação e teste novamente.",
    ],
    commands: ["ollama serve"],
    link: { label: "Verificar o servidor do Ollama", href: "http://localhost:11434/api/tags" },
    keywords: ["ollama", "10061", "connection refused", "conexão recusada", "11434"],
  },
  {
    id: "ollama-modelo-nao-encontrado",
    category: "modelos",
    environment: "local",
    question: "Ollama: modelo não encontrado",
    answer:
      "O servidor está ativo, mas o nome escolhido na aplicação não corresponde a um modelo instalado nessa máquina.",
    steps: [
      "Liste os modelos já instalados.",
      "Compare o nome completo, incluindo a parte depois de dois-pontos.",
      "Baixe o modelo selecionado caso ele não apareça na lista.",
      "Teste novamente depois do download terminar.",
    ],
    commands: ["ollama list", "ollama pull qwen3:4b"],
    keywords: ["ollama", "model not found", "modelo", "pull", "list", "não encontrado"],
  },
  {
    id: "ollama-comando-nao-reconhecido",
    category: "modelos",
    environment: "local",
    question: "O comando ollama não é reconhecido",
    answer:
      "O Ollama pode não estar instalado ou o terminal foi aberto antes da instalação e ainda não conhece o novo comando.",
    steps: [
      "Confirme que o aplicativo Ollama está instalado.",
      "Feche todos os terminais e abra um novo PowerShell.",
      "Abra o aplicativo Ollama pelo menu Iniciar.",
      "Se o comando continuar indisponível, reinstale o Ollama e reinicie o Windows.",
    ],
    link: { label: "Site oficial do Ollama", href: "https://ollama.com/download" },
    keywords: ["ollama", "comando não reconhecido", "path", "instalar"],
  },
  {
    id: "modelo-lento-timeout",
    category: "modelos",
    environment: "all",
    question: "A IA demora muito ou a solicitação expira",
    answer:
      "Modelos maiores usam mais memória e processamento. A primeira resposta também pode demorar enquanto o modelo é carregado.",
    steps: [
      "Espere a primeira resposta terminar antes de enviar outra mensagem.",
      "No Ollama, escolha um modelo menor, como qwen3:4b.",
      "Feche programas pesados para liberar memória.",
      "Em provedores por API, confira o status do serviço e tente novamente.",
      "Se a pesquisa web estiver ativa, teste temporariamente com ela desligada.",
    ],
    keywords: ["lento", "timeout", "demora", "memória", "modelo pesado", "expirou"],
  },
  {
    id: "api-key-invalida",
    category: "modelos",
    environment: "all",
    question: "A chave de API é recusada ou o teste falha",
    answer:
      "A chave precisa pertencer ao mesmo fornecedor selecionado e estar ativa. Assinatura de um chat comercial nem sempre inclui créditos para uso da API.",
    steps: [
      "Confirme se escolheu Gemini, Grok, OpenAI ou Claude corretamente.",
      "Cole a chave novamente, sem espaços antes ou depois.",
      "Verifique no painel do fornecedor se a chave está ativa.",
      "Confira se há créditos, faturamento ou cota disponível.",
      "Use Testar conexão antes de salvar.",
    ],
    note: "Nunca envie sua chave por chat, e-mail, captura de tela ou commit no GitHub.",
    keywords: ["api key", "401", "403", "unauthorized", "quota", "créditos", "chave inválida"],
  },
  {
    id: "limite-provedor",
    category: "modelos",
    environment: "all",
    question: "Aparece limite excedido, quota ou erro 429",
    answer:
      "O provedor recebeu solicitações demais ou a conta atingiu o limite de uso. Esse erro vem do serviço de IA, não do chat da aplicação.",
    steps: [
      "Aguarde alguns minutos e tente novamente.",
      "Evite clicar várias vezes enquanto uma resposta está sendo gerada.",
      "Confira cota, créditos e faturamento no painel do provedor.",
      "Escolha outro modelo ou provedor já configurado, se disponível.",
    ],
    keywords: ["429", "quota", "rate limit", "limite", "muitas solicitações", "créditos"],
  },
  {
    id: "pesquisa-web",
    category: "recursos",
    environment: "all",
    question: "A pesquisa na internet não funciona",
    answer:
      "A pesquisa web usa a Tavily e precisa de uma TAVILY_API_KEY válida no ambiente do backend. No modo automático, ela só é acionada quando a pergunta parece exigir informação atual.",
    steps: [
      "Para testar, selecione o modo de pesquisa Ligada no campo do chat.",
      "Confirme que TAVILY_API_KEY está configurada no .env local ou no serviço hospedado.",
      "Reinicie o backend depois de alterar a variável.",
      "Faça uma pergunta atual, como uma notícia ou cotação recente.",
    ],
    keywords: ["tavily", "pesquisa web", "internet", "fontes", "tavily_api_key"],
  },
  {
    id: "chat-bloqueado",
    category: "recursos",
    environment: "all",
    question: "Não consigo digitar ou enviar mensagens no chat",
    answer:
      "O campo permanece bloqueado quando nenhuma conversa foi escolhida ou quando ainda não existe um modelo de IA configurado.",
    steps: [
      "Clique em Novo chat ou selecione uma conversa recente.",
      "Abra Configurações e escolha um fornecedor e um modelo.",
      "Teste a conexão e salve a configuração.",
      "Volte ao chat e atualize a página se o campo continuar bloqueado.",
    ],
    keywords: ["chat bloqueado", "não digita", "input", "mensagem", "configuração"],
  },
  {
    id: "login-dados-incorretos",
    category: "seguranca",
    environment: "all",
    question: "Não consigo entrar na minha conta",
    answer:
      "Confira primeiro se está usando o mesmo e-mail do cadastro e se a conta já foi confirmada. Por segurança, a tela não informa qual dos dois campos está incorreto.",
    steps: [
      "Digite o e-mail completo e confira se não há espaços ou erros de digitação.",
      "Use o botão de mostrar senha para verificar o que foi digitado.",
      "Procure o e-mail de confirmação na caixa de entrada e no spam.",
      "Se acabou de errar várias vezes, aguarde alguns minutos antes de tentar novamente.",
    ],
    keywords: ["login", "entrar", "senha", "credenciais", "conta", "incorreto"],
  },
  {
    id: "email-confirmacao",
    category: "seguranca",
    environment: "all",
    question: "O e-mail de confirmação não chegou",
    answer:
      "O envio pode demorar, cair no spam ou ser bloqueado pelo limite de e-mails do serviço. Não crie várias contas seguidas com o mesmo endereço.",
    steps: [
      "Aguarde alguns minutos e verifique Spam, Lixo eletrônico e Promoções.",
      "Confirme se o endereço informado no cadastro estava correto.",
      "Se estiver testando o projeto, verifique no painel do Supabase se esse e-mail está autorizado.",
      "Em uma instalação pública, o responsável precisa configurar um serviço SMTP no Supabase.",
    ],
    keywords: ["email", "e-mail", "confirmação", "spam", "smtp", "cadastro"],
  },
  {
    id: "sessao-expirada",
    category: "seguranca",
    environment: "all",
    question: "Minha sessão expirou ou a API mostrou erro 401",
    answer:
      "O código 401 significa que a API não recebeu uma sessão válida. A aplicação encerra a sessão local para impedir acesso com um token vencido ou inválido.",
    steps: [
      "Volte à tela de login e entre novamente.",
      "Se o erro continuar, atualize a página e limpe apenas os dados deste site no navegador.",
      "No uso local, confirme que frontend e backend usam o mesmo projeto Supabase.",
      "No deploy, confira as variáveis SUPABASE_URL e SUPABASE_PUBLISHABLE_KEY do backend.",
    ],
    keywords: ["401", "sessão", "expirada", "token", "logout", "supabase"],
  },
  {
    id: "env-example",
    category: "seguranca",
    environment: "local",
    question: "Qual é a diferença entre .env e .env.example?",
    answer:
      "O .env contém os valores reais usados no seu computador e nunca deve ir para o GitHub. O .env.example mostra apenas os nomes e valores fictícios necessários para configurar o projeto.",
    steps: [
      "Envie .env.example para o repositório.",
      "Mantenha .env e Docs/infs.env somente no seu computador.",
      "Antes de publicar, confirme que .env está listado no .gitignore.",
      "Se uma chave real já foi publicada, revogue-a no provedor e gere outra.",
    ],
    keywords: ["env", "example", "github", "segredo", "variável", "chave"],
  },
  {
    id: "privacidade",
    category: "seguranca",
    environment: "all",
    question: "Posso enviar dados confidenciais para a IA?",
    answer:
      "Evite inserir senhas, chaves, documentos sigilosos ou dados pessoais sem conhecer as regras de retenção e privacidade do provedor de IA selecionado.",
    steps: [
      "Remova nomes, documentos e identificadores desnecessários antes de enviar.",
      "Nunca cole senhas ou chaves de API no chat.",
      "Considere as políticas do provedor de IA escolhido.",
      "Use apenas ambientes e provedores aprovados pela sua organização para dados sensíveis.",
    ],
    keywords: ["privacidade", "segurança", "dados", "confidencial", "lgpd", "senha"],
  },
];
