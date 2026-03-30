export interface MessageAuthor {
  id: number;
  pseudo: string;
}

export interface Message {
  id: number;
  content: string;
  createdAt: string;
  attachmentUrl: string | null;
  user: MessageAuthor | null;
}

export interface MessagesPage {
  messages: Message[];
  hasMore: boolean;
}

export interface CreateMessagePayload {
  content: string;
  file?: File;
}
