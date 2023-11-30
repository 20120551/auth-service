import { IsString, MinLength } from 'class-validator';
import { defaultValue } from 'utils/decorator/parameters';

export class ChangePasswordDto {
  @IsString()
  @MinLength(0, {
    message: "password can't be empty",
  })
  password: string;

  @defaultValue('AUTH0_DEFAULT_DB_CONNECTION', { fromEnv: true })
  connection: string;
}
