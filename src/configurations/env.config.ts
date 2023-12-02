import { registerAs } from '@nestjs/config';
import { env } from 'process';

export const auth0 = registerAs('auth0', () => ({
  clientId: env.AUTH0_MANAGER_CLIENT_ID,
  clientSecret: env.AUTH0_MANAGER_CLIENT_SECRET,
  baseUrl: env.AUTH0_BASE_URL,
  grantType: 'client_credentials',
}));

export const azure = registerAs('azure', () => ({
  key: env.AZURE_KEY,
  endpoint: env.AZURE_ENDPOINT,
  ocrModel: env.AZURE_OCR_MODEL,
}));

export const firebase = registerAs('firebase', () => ({
  apiKey: env.FIREBASE_API_KEY,
  authDomain: env.FIREBASE_AUTH_DOMAIN,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.FIREBASE_MESSAGE_SENDER_ID,
  appId: env.FIREBASE_APP_ID,
  measurementId: env.FIREBASE_MEMSUREMENT_ID,
}));
