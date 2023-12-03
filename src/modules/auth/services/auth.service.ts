import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { Auth0ModuleOptions, Auth0PairToken } from 'utils/auth0';
import {
  createCamelCaseFromObject,
  createQueryUrl,
  createSnakeCaseFromObject,
} from 'utils/request';
import {
  RefreshTokenDto,
  ResourceOwnerLoginDto,
  SignupDto,
  SocialLoginDto,
} from '../resources/dto';
import { PairTokenResponse } from '../resources/response';
import { ChangePasswordDto } from '../resources/dto/changePassword.dto';

export const IAuthService = 'IAuthService';
export interface IAuthService {
  signup(signupDto: SignupDto): Promise<void>;
  login(
    resourceOwnerLoginDto: ResourceOwnerLoginDto,
  ): Promise<PairTokenResponse>;
  createSocialLoginUrl(socialLoginDto: SocialLoginDto): Promise<string>;
  changePassword(changePasswordDto: ChangePasswordDto): Promise<void>;
  refreshToken(refreshTokenDto: RefreshTokenDto): Promise<PairTokenResponse>;
}

@Injectable()
export class AuthService implements IAuthService {
  private readonly _auth0Client: AxiosInstance;
  private readonly _options: Auth0ModuleOptions;
  constructor(
    @Inject(Auth0ModuleOptions)
    auth0Options: Auth0ModuleOptions,
  ) {
    this._options = auth0Options;
    this._auth0Client = axios.create({
      baseURL: auth0Options.baseUrl,
    });
  }

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<void> {
    await this._auth0Client.post(
      '/dbconnections/change_password',
      createSnakeCaseFromObject(changePasswordDto),
    );
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<PairTokenResponse> {
    const res = await this._auth0Client.post(
      '/oauth/token',
      createSnakeCaseFromObject(refreshTokenDto),
    );

    return createCamelCaseFromObject<Auth0PairToken, PairTokenResponse>(
      res.data,
    );
  }

  async signup(signupDto: SignupDto): Promise<void> {
    await this._auth0Client.post(
      '/dbconnections/signup',
      createSnakeCaseFromObject(signupDto),
    );
  }

  async login(
    resourceOwnerLoginDto: ResourceOwnerLoginDto,
  ): Promise<PairTokenResponse> {
    const { email, ...payload } = resourceOwnerLoginDto;
    const res = await this._auth0Client.post(
      '/oauth/token',
      createSnakeCaseFromObject({
        username: email,
        ...payload,
      }),
    );
    return createCamelCaseFromObject<Auth0PairToken, PairTokenResponse>(
      res.data,
    );
  }

  createSocialLoginUrl(socialLoginDto: SocialLoginDto): Promise<string> {
    const url = createQueryUrl(
      `${this._options.baseUrl}/authorize`,
      createSnakeCaseFromObject(socialLoginDto),
    );

    return Promise.resolve(url);
  }
}
