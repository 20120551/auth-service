import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { Auth0ModuleOptions, Auth0PairToken, IAuth0Service } from 'utils/auth0';
import {
  createCamelCaseFromObject,
  createQueryUrl,
  createSnakeCaseFromObject,
} from 'utils/request';
import {
  ResourceOwnerLoginDto,
  SignupDto,
  SocialLoginDto,
} from '../resources/dto';
import { PairTokenResponse } from '../resources/response';

export const IAuthService = 'IAuthService';
export interface IAuthService {
  signup(signupDto: SignupDto): Promise<void>;
  login(
    resourceOwnerLoginDto: ResourceOwnerLoginDto,
  ): Promise<PairTokenResponse>;
  createSocialLoginUrl(socialLoginDto: SocialLoginDto): Promise<string>;
}

@Injectable()
export class AuthService implements IAuthService {
  private readonly _auth0Client: AxiosInstance;
  private readonly _options: Auth0ModuleOptions;
  constructor(
    @Inject(IAuth0Service) private readonly _auth0Service: IAuth0Service,
    @Inject(Auth0ModuleOptions) auth0Options: Auth0ModuleOptions,
  ) {
    this._options = auth0Options;
    this._auth0Client = axios.create({
      baseURL: auth0Options.api.baseUrl,
    });
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
    const res = await this._auth0Client.post(
      '/oauth/token',
      createSnakeCaseFromObject(resourceOwnerLoginDto),
    );
    return createCamelCaseFromObject<Auth0PairToken, PairTokenResponse>(
      res.data,
    );
  }

  createSocialLoginUrl(socialLoginDto: SocialLoginDto): Promise<string> {
    const url = createQueryUrl(
      `${this._options.api.baseUrl}/authorize`,
      socialLoginDto,
    );

    return Promise.resolve(url);
  }
}
