import { User, UserRole } from '../models/user.model';

export async function findById(id: number): Promise<User> {
  const user = await User.findByPk(id);
  if (!user) {
    const err = Object.assign(new Error('User not found'), { status: 404 });
    throw err;
  }
  return user;
}

export async function findAll(): Promise<User[]> {
  return User.findAll({ order: [['createdAt', 'DESC']] });
}

export async function updateUser(
  id: number,
  data: { pseudo?: string; bio?: string },
): Promise<User> {
  const user = await findById(id);
  await user.update(data);
  return user;
}

export async function updateUserAdmin(
  id: number,
  data: { pseudo?: string; bio?: string; email?: string; role?: UserRole },
): Promise<User> {
  const user = await findById(id);
  await user.update(data);
  return user;
}

export async function deleteUser(id: number): Promise<void> {
  const user = await findById(id);
  await user.destroy();
}
