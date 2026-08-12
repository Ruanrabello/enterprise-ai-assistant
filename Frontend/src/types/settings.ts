export type Provider = "ollama" | "gemini" | "grok" | "openai" | "claude";

export type RequestStatus = "idle" | "saving" | "success" | "error";
export type ConnectionStatus = "idle" | "testing" | "success" | "error";

export interface ProfileResponse {
  id: number;
  nome: string;
  email: string;
}

export interface AIConfigurationResponse {
  id: number;
  usuario_id: number;
  provider: Provider;
  modelo: string;
  possui_api_key: boolean;
}
