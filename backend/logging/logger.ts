import pino from 'pino';
import fs from 'fs';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const level = process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug');
const logDir = path.join(process.cwd(), 'logs');
const devLogPath = path.join(logDir, 'dev.log');

if (!isProduction) {
  fs.mkdirSync(logDir, { recursive: true });
}

export const logger = pino({
  level,
  base: { service: 'le3eb-club' },
  redact: ['req.headers.authorization', '*.password', '*.passwordHash', '*.token', '*.refreshToken', '*.receipt'],
  ...(isProduction ? {} : {
    transport: {
      targets: [
        { level, target: 'pino-pretty', options: { colorize: true } },
        { level, target: 'pino/file', options: { destination: devLogPath, mkdir: true } },
      ],
    },
  }),
});
