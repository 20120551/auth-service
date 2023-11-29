import { defaultValue } from 'utils/decorator/parameters';

export class Auth0ClientCredential {
  @defaultValue('AUTH0_CLIENT_ID', { fromEnv: true })
  client_id: string;

  @defaultValue('AUTH0_CLIENT_ID', { fromEnv: true })
  client_secret: string;

  @defaultValue('AUTH0_BASE_URL', { fromEnv: true })
  audience: string;

  @defaultValue('client_credentials')
  grant_type: string;
}
