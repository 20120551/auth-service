import { IsEmail, IsString, MinLength } from 'class-validator';
import { defaultValue } from 'utils/decorator/parameters';

export class ResourceOwnerLoginDto {
  @defaultValue('AUTH0_CLIENT_ID', { fromEnv: true })
  client_id?: string;

  @IsEmail()
  email?: string;

  @defaultValue('AUTH0_CLIENT_SECRET', { fromEnv: true })
  client_secret?: string;

  @defaultValue('openid profile email offline_access')
  scope?: string;

  @IsString()
  username: string;

  @IsString()
  @MinLength(0, {
    message: "password can't be empty",
  })
  password: string;
}
