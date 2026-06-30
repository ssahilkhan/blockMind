import dotenv from 'dotenv';
dotenv.config();

export interface Config {
  RPC_URL: string;
  PORT: number;
  DATABASE_URL: string;
  NODE_ENV: string;
  LOG_LEVEL: string;
}

const REQUIRED_VARS: Array<keyof Config> = ['RPC_URL'];

for (const key of REQUIRED_VARS) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const config: Config = {
  RPC_URL: process.env.RPC_URL!,
  PORT: parseInt(process.env.PORT || '3000', 10),
  DATABASE_URL: process.env.DATABASE_URL || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};
