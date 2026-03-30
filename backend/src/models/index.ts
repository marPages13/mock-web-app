import { sequelize } from '../config/database';
import { User } from './user.model';
import { Message } from './message.model';

// Associations
User.hasMany(Message, { foreignKey: 'userId', as: 'messages', onDelete: 'CASCADE' });
Message.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { sequelize, User, Message };
