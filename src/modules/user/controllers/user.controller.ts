import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
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
import {
  ChangePasswordDto,
  LogoutDto,
  UpdateUserProfileDto,
  VerifyEmailDto,
} from '../resources/dto';
import {
  TokenRevalidatingInterceptor,
  UpsertSnapshotUserInterceptor,
} from 'interceptors';

// @UseInterceptors(TokenRevalidatingInterceptor)
@UseGuards(AuthenticatedGuard)
@Controller('/api/user')
export class UserController {
  constructor(
    @Inject(IUserService) private readonly _userService: IUserService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async profile(@User() user: UserResponse) {
    const userResponse = await this._userService.getUserProfile(user);
    return userResponse;
  }

  @UseInterceptors(UpsertSnapshotUserInterceptor)
  @HttpCode(HttpStatus.OK)
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

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/logout')
  async logout(@Body() logoutDto: LogoutDto, @User() user: UserResponse) {
    return this._userService.logout(user, logoutDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/verify-email')
  async verifyEmail(
    @Body() verifyEmailDto: VerifyEmailDto,
    @User() user: UserResponse,
  ) {
    await this._userService.sendVerificationEmail(user, verifyEmailDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @User() user: UserResponse,
  ) {
    await this._userService.changePassword(user, changePasswordDto);
  }

  @UseInterceptors(UpsertSnapshotUserInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @User() user: UserResponse,
  ) {
    const payload = {
      filename: file.originalname,
      buffer: file.buffer,
      mimeType: file.mimetype,
    };

    const userResponse = await this._userService.updateUserAvatar(
      user,
      payload,
    );

    return userResponse;
  }
}
