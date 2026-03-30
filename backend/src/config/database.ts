import { Sequelize } from 'sequelize';
import { env } from './env';

export const sequelize = new Sequelize(env.db.name, env.db.user, env.db.password, {
  dialect: 'mysql',
  host: env.db.host,
  port: env.db.port,
  logging: false,
});
