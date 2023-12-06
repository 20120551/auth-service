import { IsEmail, IsString, MinLength } from 'class-validator';
import { defaultValue } from 'utils/decorator/parameters';

class UpsertUserDto {
  givenName: string;
  familyName: string;
  name: string;
  nickname: string;
}

export class CreateUserDto extends UpsertUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(0, {
    message: "password can't be empty",
  })
  password: string;

  @defaultValue('AUTH0_DEFAULT_DB_CONNECTION', { fromEnv: true })
  connection: string;
}

export class UpdateUserProfileDto extends UpsertUserDto {}

export class AdminUpdateUserProfileDto extends UpdateUserProfileDto {
  blocked: boolean;
}
