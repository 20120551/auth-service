import { IsOptional, IsString } from 'class-validator';
import { defaultValue } from 'utils/decorator/parameters';

export class RefreshTokenDto {
  @defaultValue('AUTH0_CLIENT_ID', { fromEnv: true })
  clientId: string;

  @defaultValue('AUTH0_CLIENT_SECRET', { fromEnv: true })
  clientSecret: string;

  @defaultValue('openid profile email offline_access')
  scope?: string;

  @defaultValue('authorization_code', {
    filter: (o) => o.refreshToken === undefined,
  })
  @defaultValue('refresh_token')
  grantType?: string;

  @IsOptional()
  code?: string;

  @IsOptional()
  redirectUri?: string;

  @IsOptional()
  refreshToken?: string;
}
