import mongoose, { Connection } from 'mongoose';
import config from '../../app/config';

export default async (): Promise<Connection> => {
  const { connection } = await mongoose.connect(config.database.url);

  console.log('✌️ DB loaded and connected!');

  return connection;
};
