import { IsEmail, IsString, MinLength } from 'class-validator';
import { defaultValue } from 'utils/decorator/parameters';

export class ResourceOwnerLoginDto {
  @defaultValue('AUTH0_CLIENT_ID', { fromEnv: true })
  clientId?: string;

  @defaultValue('AUTH0_CLIENT_SECRET', { fromEnv: true })
  clientSecret?: string;

  @defaultValue('openid profile email offline_access')
  scope?: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(0, {
    message: "password can't be empty",
  })
  password: string;
}
