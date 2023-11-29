import { IsString, MinLength } from 'class-validator';
import { env } from 'process';
import { defaultValue } from 'utils/decorator/parameters';

export class SignupDto {
  @defaultValue('AUTH0_CLIENT_ID', { fromEnv: true })
  client_id: string;

  @defaultValue('AUTH0_DEFAULT_DB_CONNECTION', { fromEnv: true })
  connection: string;

  @IsString()
  email: string;

  @IsString()
  username: string;

  @IsString()
  @MinLength(0, {
    message: "password can't be empty",
  })
  password: string;
}
