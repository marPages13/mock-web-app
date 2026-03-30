import { apiClient } from './client';
import type { Message, MessagesPage, CreateMessagePayload } from '../types/message.types';

export async function getMessages(params?: {
  limit?: number;
  before?: number;
}): Promise<MessagesPage> {
  const { data } = await apiClient.get<MessagesPage>('/messages', { params });
  return data;
}

export async function createMessage(payload: CreateMessagePayload): Promise<Message> {
  if (payload.file) {
    const form = new FormData();
    form.append('content', payload.content);
    form.append('file', payload.file);
    const { data } = await apiClient.post<{ message: Message }>('/messages', form);
    return data.message;
  }
  const { data } = await apiClient.post<{ message: Message }>('/messages', {
    content: payload.content,
  });
  return data.message;
}

export async function deleteMessage(id: number): Promise<void> {
  await apiClient.delete(`/messages/${id}`);
}
