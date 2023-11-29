import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { IAuthService } from '../services';
import {
  ResourceOwnerLoginDto,
  SignupDto,
  SocialLoginDto,
} from '../resources/dto';

@Controller('/api/auth')
export class AuthController {
  constructor(
    @Inject(IAuthService) private readonly _authService: IAuthService,
  ) {}

  @Get('social')
  socialLogin(@Query() socialLoginDto: SocialLoginDto) {
    return this._authService.createSocialLoginUrl(socialLoginDto);
  }

  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this._authService.signup(signupDto);
  }

  @Post('login')
  login(@Body() resourceOwnerLoginDto: ResourceOwnerLoginDto) {
    return this._authService.login(resourceOwnerLoginDto);
  }
}
