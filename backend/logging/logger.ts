import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  base: { service: 'le3eb-club' },
  redact: ['req.headers.authorization', '*.password', '*.passwordHash', '*.token', '*.refreshToken', '*.receipt'],
  ...(isProduction ? {} : { transport: { target: 'pino-pretty', options: { colorize: true } } }),
});
