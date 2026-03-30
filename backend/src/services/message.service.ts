import { Op } from 'sequelize';
import { Message } from '../models/message.model';
import { User } from '../models/user.model';

const DEFAULT_LIMIT = 30;

export async function getMessages(params: {
  limit?: number;
  before?: number;
  after?: number;
}): Promise<{ messages: Message[]; hasMore: boolean }> {
  const limit = Math.min(params.limit ?? DEFAULT_LIMIT, 100);

  const where: Record<string, unknown> = {};
  if (params.before) where.id = { [Op.lt]: params.before };
  if (params.after) where.id = { ...((where.id as object) ?? {}), [Op.gt]: params.after };

  const messages = await Message.findAll({
    where,
    order: [['id', 'DESC']],
    limit: limit + 1,
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'pseudo'],
      },
    ],
  });

  const hasMore = messages.length > limit;
  if (hasMore) messages.pop();

  return { messages, hasMore };
}

export async function createMessage(
  userId: number,
  content: string,
  attachmentKey: string | null = null,
): Promise<Message> {
  const message = await Message.create({ userId, content, attachmentKey });
  return Message.findByPk(message.id, {
    include: [{ model: User, as: 'user', attributes: ['id', 'pseudo'] }],
  }) as Promise<Message>;
}

export async function deleteMessage(id: number): Promise<void> {
  const message = await Message.findByPk(id);
  if (!message) {
    const err = Object.assign(new Error('Message not found'), { status: 404 });
    throw err;
  }
  await message.destroy();
}
