import { IsString, MinLength } from 'class-validator';
import { SupportedRole } from 'configurations/role.config';
import { defaultValue } from 'utils/decorator/parameters';

export class SignupDto {
  @defaultValue('AUTH0_CLIENT_ID', { fromEnv: true })
  clientId: string;

  @defaultValue('AUTH0_DEFAULT_DB_CONNECTION', { fromEnv: true })
  connection: string;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @defaultValue({
    role: SupportedRole.USER,
  })
  userMetadata: {
    role: SupportedRole;
  };

  @IsString()
  @MinLength(0, {
    message: "password can't be empty",
  })
  password: string;
}
