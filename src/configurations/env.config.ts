import { registerAs } from '@nestjs/config';
import { env } from 'process';

export const auth0 = registerAs('auth0', () => ({
  api: {
    clientId: env.AUTH0_CLIENT_ID,
    clientSecret: env.AUTH0_CLIENT_SECRET,
    baseUrl: env.AUTH0_BASE_URL,
  },
  manager: {
    clientId: env.AUTH0_CLIENT_ID,
    clientSecret: env.AUTH0_CLIENT_SECRET,
    audience: env.AUTH0_BASE_URL,
    grantType: 'client_credentials',
  },
}));
