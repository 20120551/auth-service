import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { Auth0ModuleOptions, IAuth0Service } from 'utils/auth0';
import { VerifyEmailDto } from '../resources/dto';

export const IUserService = 'IUserService';
export interface IUserService {
  sendVerificationEmail(verifyEmailDto: VerifyEmailDto): Promise<void>;
}

@Injectable()
export class UserService implements IUserService {
  private readonly _auth0Client: AxiosInstance;
  constructor(
    @Inject(IAuth0Service) private readonly _auth0Service: IAuth0Service,
    @Inject(Auth0ModuleOptions) auth0Options: Auth0ModuleOptions,
  ) {
    this._auth0Client = axios.create({
      baseURL: auth0Options.baseUrl,
    });
  }
  async sendVerificationEmail(verifyEmailDto: VerifyEmailDto): Promise<void> {
    try {
      const { access_token } = await this._auth0Service.signToken({
        client_id: verifyEmailDto.client_id,
        client_secret: verifyEmailDto.client_secret,
        grant_type: verifyEmailDto.grant_type,
        audience: verifyEmailDto.audience,
      });

      await this._auth0Client.post(
        '/api/v2/jobs/verification-email',
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );
    } catch (err) {
      await this.sendVerificationEmail(verifyEmailDto);
    }
  }
}
