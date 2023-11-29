import { IsString } from 'class-validator';
import { defaultValue } from 'utils/decorator/parameters';

export type SupportedSocialLogin = 'google-oauth2' | 'facebook';
export class SocialLoginDto {
  @defaultValue('AUTH0_CLIENT_ID', { fromEnv: true })
  client_id: string;

  @defaultValue('token')
  response_type: 'code' | 'token';

  @IsString()
  connection: SupportedSocialLogin;

  @IsString()
  redirect_uri: string;
  state?: string;

  @defaultValue('offline')
  access_type?: string;
}
