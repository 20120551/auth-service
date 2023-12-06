import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { Auth0ModuleOptions, Auth0UserInfo, IAuth0Service } from 'utils/auth0';
import { UserResponse } from '../resources/response';
import { AdminUpdateUserProfileDto, CreateUserDto } from '../resources/dto';
import BPromise from 'bluebird';
import {
  createCamelCaseFromObject,
  createSnakeCaseFromObject,
} from 'utils/request';

export const IAdminService = 'IAdminService';
export interface IAdminService {
  getUsers(): Promise<UserResponse[]>;
  getUser(id: string): Promise<UserResponse>;
  createUser(createUserDto: CreateUserDto): Promise<UserResponse>;
  updateUser(
    id: string,
    adminUpdateUserProfileDto: AdminUpdateUserProfileDto,
  ): Promise<UserResponse>;
}

@Injectable()
export class AdminService implements IAdminService {
  private readonly _auth0Client: AxiosInstance;
  constructor(
    @Inject(IAuth0Service)
    private readonly _auth0Service: IAuth0Service,
    @Inject(Auth0ModuleOptions)
    auth0Options: Auth0ModuleOptions,
  ) {
    this._auth0Client = axios.create({
      baseURL: auth0Options.baseUrl,
    });
  }

  async getUser(id: string): Promise<UserResponse> {
    const token = await this._getToken();
    const res = await this._auth0Client.get(`api/v2/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return createCamelCaseFromObject<Auth0UserInfo, UserResponse>(res.data);
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserResponse> {
    const token = await this._getToken();
    const res = await this._auth0Client.post(
      'api/v2/users',
      createSnakeCaseFromObject(createUserDto),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return createCamelCaseFromObject<Auth0UserInfo, UserResponse>(res.data);
  }

  async getUsers(): Promise<UserResponse[]> {
    const token = await this._getToken();
    const res = await this._auth0Client.get('api/v2/users', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const users = await BPromise.map(res.data, (user: Auth0UserInfo) =>
      createCamelCaseFromObject<Auth0UserInfo, UserResponse>(user),
    );
    return users;
  }

  async updateUser(
    id: string,
    adminUpdateUserProfileDto: AdminUpdateUserProfileDto,
  ): Promise<UserResponse> {
    const token = await this._getToken();
    const user = await this._updateUser(token, {
      userId: id,
      ...adminUpdateUserProfileDto,
    });

    return user;
  }

  private async _getToken() {
    const { access_token } = await this._auth0Service.signToken();
    return access_token;
  }

  private async _updateUser<T extends { userId: string }>(
    token: string,
    updateUser: T,
  ): Promise<UserResponse> {
    const { userId, ...payload } = updateUser;
    const res = await this._auth0Client.patch(
      `/api/v2/users/${userId}`,
      createSnakeCaseFromObject(payload),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return createCamelCaseFromObject<Auth0UserInfo, UserResponse>(res.data);
  }
}
