import { IsString } from 'class-validator';

export class UpdateUserStudentCardDto {
  buffer: Buffer;
  @IsString()
  filename: string;
  mimeType: string;
}
