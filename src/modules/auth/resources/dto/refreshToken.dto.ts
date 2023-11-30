import { IsString } from 'class-validator';
import { defaultValue } from 'utils/decorator/parameters';

export class RefreshTokenDto {
  @defaultValue('AUTH0_CLIENT_ID', { fromEnv: true })
  clientId: string;

  @defaultValue('AUTH0_CLIENT_SECRET', { fromEnv: true })
  clientSecret: string;

  @defaultValue('openid profile email offline_access')
  scope?: string;

  @defaultValue('refresh_token')
  grantType: string;

  @IsString()
  refreshToken: string;
}
