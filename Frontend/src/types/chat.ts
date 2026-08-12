export type ChatAuthor = "user" | "ai";
export type WebSearchMode = "auto" | "on" | "off";

export interface WebSource {
  titulo: string;
  url: string;
}

export interface Conversation {
  id: number;
  titulo: string;
  usuario_id?: number;
}

export interface ChatMessage {
  id: number | string;
  conversa_id?: number;
  usuario: ChatAuthor;
  texto: string;
  modelo?: string | null;
  fontes?: WebSource[];
  pesquisa_web_usada?: boolean;
}

export interface NewMessageResponse {
  mensagem_usuario: ChatMessage;
  mensagem_assistente: ChatMessage;
  titulo?: string | null;
  fontes: WebSource[];
  pesquisa_web_usada: boolean;
}
