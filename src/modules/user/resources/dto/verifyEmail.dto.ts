import { IsString } from 'class-validator';
import { defaultValue } from 'utils/decorator/parameters';
import { Auth0ClientCredential } from './auth0ClientCredential.dto';

export type ProviderSupport = 'google-oauth2' | 'facebook' | 'auth0';
export class VerifyEmailDto extends Auth0ClientCredential {
  @IsString()
  user_id: string;

  @defaultValue({
    provider: 'auth0',
    user_id: '',
  })
  identity: {
    user_id: string;
    provider: ProviderSupport;
  };
}
