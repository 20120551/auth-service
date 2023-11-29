import { Injectable } from '@nestjs/common';
import {
  Auth0AccessToken,
  Auth0ModuleOptions,
  Auth0ClientCredentialTokenOptions,
  Auth0UserInfo,
} from '.';
import axios, { AxiosInstance } from 'axios';

export const IAuth0Service = 'IAuth0Service';
export interface IAuth0Service {
  signToken(
    options: Auth0ClientCredentialTokenOptions,
  ): Promise<Auth0AccessToken>;
  verifyToken(token: Auth0AccessToken): Promise<Auth0UserInfo>;
}

@Injectable()
export class Auth0Service implements IAuth0Service {
  private readonly _auth0Client: AxiosInstance;
  constructor(auth0Options: Auth0ModuleOptions) {
    this._auth0Client = axios.create({
      baseURL: auth0Options.baseUrl,
    });
  }
  async verifyToken(token: Auth0AccessToken): Promise<Auth0UserInfo> {
    const res = await this._auth0Client.get('/userinfo', {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });
    return res.data as Auth0UserInfo;
  }

  async signToken(
    options: Auth0ClientCredentialTokenOptions,
  ): Promise<Auth0AccessToken> {
    const res = await this._auth0Client.post('/oauth/token', options);
    return res.data as Auth0AccessToken;
  }
}
