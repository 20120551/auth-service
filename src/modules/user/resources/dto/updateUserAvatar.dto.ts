import { IsString } from 'class-validator';

export class UpdateUserAvatarDto {
  buffer: Buffer;
  @IsString()
  filename: string;
  mimeType: string;
}
