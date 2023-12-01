import { IsString } from 'class-validator';
import { Auth0SupportedSocialLogin } from 'utils/auth0';
import { defaultValue } from 'utils/decorator/parameters';

export class SocialLoginDto {
  @defaultValue('AUTH0_CLIENT_ID', { fromEnv: true })
  clientId: string;

  @defaultValue('code')
  responseType: 'code' | 'token';

  @IsString()
  connection: Auth0SupportedSocialLogin;

  @IsString()
  redirectUri: string;
  state?: string;

  @defaultValue('openid profile email offline_access')
  scope?: string;

  @defaultValue('offline')
  accessType?: string;
}
