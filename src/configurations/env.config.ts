import { registerAs } from '@nestjs/config';
import { env } from 'process';

export const auth0 = registerAs('auth0', () => ({
  clientId: env.AUTH0_CLIENT_ID,
  clientSecret: env.AUTH0_CLIENT_SECRET,
  baseUrl: env.AUTH0_BASE_URL,
}));
