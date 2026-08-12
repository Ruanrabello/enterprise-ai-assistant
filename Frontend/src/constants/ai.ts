import type { Provider } from "../types/settings";

export const PROVIDERS: Provider[] = [
  "ollama",
  "gemini",
  "grok",
  "openai",
  "claude",
];

export const PROVIDER_LABELS: Record<Provider, string> = {
  ollama: "Ollama (local)",
  gemini: "Gemini",
  grok: "Grok",
  openai: "OpenAI",
  claude: "Claude",
};

export const PROVIDER_MODELS: Record<Provider, string[]> = {
  ollama: [
    "qwen3:4b",
    "qwen3:8b",
    "gemma4:e2b",
    "gemma4:e4b",
    "gemma4:latest",
    "gemma4:12b",
    "llama3.1:8b",
    "deepseek-r1:8b",
    "qwen2.5-coder:7b",
  ],
  gemini: ["gemini-2.5-flash", "gemini-2.5-pro"],
  grok: ["grok-4"],
  openai: ["gpt-5.6-luna", "gpt-5.6-terra", "gpt-5.6-sol", "gpt-5.4-mini"],
  claude: ["claude-sonnet-5", "claude-opus-5", "claude-fable-5"],
};
