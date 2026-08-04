# AI Business Assistant

Assistente de IA para uso empresarial, com chat conversacional, suporte a múltiplos
provedores de modelos de linguagem (Ollama local, Gemini e Grok), gestão de
documentos e geração de relatórios.

## Stack

**Backend**
- FastAPI
- SQLAlchemy + PostgreSQL
- LangChain (integração com Ollama)
- Pydantic

**Frontend**
- React + Vite
- TypeScript
- Tailwind CSS v4
- React Router
- Axios
- react-markdown + remark-gfm

## Funcionalidades

- Chat com histórico de conversas, separado por usuário e por conversa
- Respostas da IA renderizadas em Markdown (listas, tabelas, títulos, negrito, etc.)
- Múltiplos provedores de IA configuráveis pela interface:
  - **Ollama** (modelos rodando localmente na máquina)
  - **Gemini** (Google, via API Key)
  - **Grok** (xAI, via API Key)
- Teste de conexão do modelo configurado antes de usar
- Indicação de qual modelo gerou cada resposta
- Interface bloqueada com aviso quando nenhum modelo está configurado

## Estrutura do projeto

```
Backend/
  App/
    database/
      models/          # Usuario, Conversa, Mensagem, Documento, ConfiguracaoIA
      database.py       # Engine, sessão e Base do SQLAlchemy
    routers/            # Endpoints (chat, documentos, relatorios, configuracoes)
    schemas/             # Schemas Pydantic (validação de entrada/saída)
    services/
      chatservice.py     # Regras de negócio de conversas e mensagens
      ia_service.py       # Ponto de entrada para geração de resposta da IA
      LLM/
        base.py           # Interface LLMProvider
        ollama_provider.py
        gemini_provider.py
        grok_provider.py
        factory.py         # ProviderFactory - decide qual provider usar
    config.py             # Variáveis de ambiente (DATABASE_URL, Supabase)
    main.py               # Ponto de entrada da API
  Docs/
    infs.env              # Variáveis de ambiente (não versionado)

Frontend/
  src/
    Components/
      Chat/                # ChatWindow, ChatInput, ChatMessage
      Layout/               # Sidebar, Header, Layout, RecentActivities
    Pages/                  # Dashboard, Chat, Documentos, Relatorio, Settings
    routes/                 # AppRoutes
    Services/               # Cliente Axios (api.ts)
    types/                   # Tipos TypeScript compartilhados
```

## Arquitetura de IA

A integração com modelos de linguagem segue o padrão **Strategy**, através da
interface `LLMProvider`. Cada provedor (Ollama, Gemini, Grok) implementa essa
interface, e a `ProviderFactory` decide qual instanciar com base na configuração
salva pelo usuário no banco de dados. Isso permite trocar de modelo pela interface,
sem precisar alterar código ou reiniciar o backend.

```
Tela de Configurações (React)
        ↓ usuário escolhe fornecedor + modelo (+ API Key, se necessário)
        ↓
PUT /configuracoes/ia
        ↓
Salva em ConfiguracaoIA (banco de dados)
        ↓
Próxima mensagem de chat → ProviderFactory lê a configuração salva
        ↓
Usa o provider correspondente para gerar a resposta
```

## Como rodar

### Backend
```bash
cd Backend/App
pip install -r requirements.txt
uvicorn main:app --reload
```

Crie o arquivo `Docs/infs.env` com:
```
DATABASE_URL=postgresql://usuario:senha@localhost:5432/nome_do_banco
SUPABASE_URL=
SUPABASE_KEY=
```

### Frontend
```bash
cd Frontend
npm install
npm run dev
```

### Modelos locais (Ollama)
Para usar modelos locais, é necessário ter o [Ollama](https://ollama.com) instalado
e baixar o modelo desejado antes de configurá-lo na aplicação:
```bash
ollama pull qwen3:8b
ollama pull gemma4
ollama pull llama3.3
ollama pull deepseek-r1
```

## Andamento do projeto

### Sprint 1 — Estrutura inicial
- Setup do backend (FastAPI + PostgreSQL + SQLAlchemy)
- Setup do frontend (React + Vite + Tailwind v4)
- Models: Usuario, Conversa, Mensagem, Documento
- CRUD de conversas e mensagens
- Layout base: Sidebar, Header, rotas

### Sprint 2 — Chat funcional
- Envio e listagem de mensagens em tempo real
- Separação visual das mensagens (usuário x IA), estilo ChatGPT/Claude
- Renderização de Markdown nas respostas (listas, tabelas, títulos, negrito)
- Indicador "Pensando..." com animação
- Auto-scroll e tela inicial de boas-vindas
- Optimistic update ao enviar mensagem

### Sprint 3 — Múltiplos provedores de IA
- Arquitetura `LLMProvider` (Strategy pattern) para trocar de modelo sem alterar código
- Providers implementados: Ollama (local), Gemini e Grok
- Tela de Configurações com seleção de fornecedor e modelo
- Persistência da configuração no banco de dados
- Botão de teste de conexão
- Exibição do modelo usado em cada resposta da IA
- Bloqueio do chat quando nenhum modelo está configurado

### Próximas sprints
- [ ] Retornar mensagem do usuário + resposta da IA em uma única chamada (POST)
- [ ] Autenticação de usuários (hoje o sistema usa um usuário fixo)
- [ ] Upload e processamento de documentos
- [ ] Geração de relatórios
- [ ] Streaming de respostas da IA
- [ ] Migrações de banco com Alembic
- [ ] Lista de modelos Ollama dinâmica (via API do próprio Ollama)

## Autor

Ruan
