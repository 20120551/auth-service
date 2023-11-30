import { IsEmail } from 'class-validator';
import { defaultValue } from 'utils/decorator/parameters';

export class ChangePasswordDto {
  @defaultValue('AUTH0_CLIENT_ID', { fromEnv: true })
  clientId: string;

  @IsEmail()
  email: string;

  @defaultValue('AUTH0_DEFAULT_DB_CONNECTION', { fromEnv: true })
  connection: string;
}
