import { defaultValue } from 'utils/decorator/parameters';

export class LogoutDto {
  @defaultValue('AUTH0_CLIENT_ID', { fromEnv: true })
  clientId: string;

  @defaultValue(true)
  federated: boolean;
}
