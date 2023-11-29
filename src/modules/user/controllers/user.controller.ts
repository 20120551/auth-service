import {
  Body,
  Controller,
  Get,
  Inject,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { IUserService } from '../services';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from 'utils/decorator/parameters';
import { UserResponse } from '../resources/response';
import { AuthenticatedGuard } from 'guards';
import { UpdateUserProfileDto, VerifyEmailDto } from '../resources/dto';

@UseGuards(AuthenticatedGuard)
@Controller('/api/user')
export class UserController {
  constructor(
    @Inject(IUserService) private readonly _userService: IUserService,
  ) {}

  @Get()
  async profile(@User() user: UserResponse) {
    return user;
  }

  @Post()
  async updateProfile(
    @Body() updateUserProfileDto: UpdateUserProfileDto,
    @User() user: UserResponse,
  ) {
    const userResponse = await this._userService.updateUserProfile(
      user,
      updateUserProfileDto,
    );
    return userResponse;
  }

  @Post('/verify-email')
  async verifyEmail(
    @Body() verifyEmailDto: VerifyEmailDto,
    @User() user: UserResponse,
  ) {
    await this._userService.sendVerificationEmail(user, verifyEmailDto);
  }

  @Post('/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        // max 10mb
        validators: [new MaxFileSizeValidator({ maxSize: 1000 * 1000 * 10 })],
      }),
    )
    file: Express.Multer.File,
    @User() user: UserResponse,
  ) {
    const payload = {
      filename: file.filename,
      buffer: file.buffer,
      mimeType: file.mimetype,
    };

    const userResponse = await this._userService.updateUserAvatar(
      user,
      payload,
    );

    return userResponse;
  }

  @Post('/student-card')
  @UseInterceptors(FileInterceptor('file'))
  async uploadStudentCard(
    @UploadedFile(
      new ParseFilePipe({
        // max 10mb
        validators: [new MaxFileSizeValidator({ maxSize: 1000 * 1000 * 10 })],
      }),
    )
    file: Express.Multer.File,
    @User() user: UserResponse,
  ) {
    const payload = {
      filename: file.filename,
      buffer: file.buffer,
      mimeType: file.mimetype,
    };

    const userResponse = await this._userService.updateUserStudentCard(
      user,
      payload,
    );

    return userResponse;
  }
}
