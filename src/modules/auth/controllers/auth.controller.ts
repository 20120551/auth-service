import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { IAuthService } from '../services';
import {
  ChangePasswordDto,
  RefreshTokenDto,
  ResourceOwnerLoginDto,
  SignupDto,
  SocialLoginDto,
} from '../resources/dto';
import {
  TokenCachingInterceptor,
  UpsertSnapshotUserInterceptor,
} from 'interceptors';

@Controller('/api/auth')
export class AuthController {
  constructor(
    @Inject(IAuthService) private readonly _authService: IAuthService,
  ) {}

  @Get('social')
  socialLogin(@Query() socialLoginDto: SocialLoginDto) {
    return this._authService.createSocialLoginUrl(socialLoginDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this._authService.signup(signupDto);
  }

  @UseInterceptors(UpsertSnapshotUserInterceptor)
  @UseInterceptors(TokenCachingInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() resourceOwnerLoginDto: ResourceOwnerLoginDto) {
    return this._authService.login(resourceOwnerLoginDto);
  }

  @UseInterceptors(TokenCachingInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this._authService.refreshToken(refreshTokenDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('change-password')
  changePassword(@Body() changePassword: ChangePasswordDto) {
    return this._authService.changePassword(changePassword);
  }
}
