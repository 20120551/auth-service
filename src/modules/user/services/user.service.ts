import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { Auth0ModuleOptions, Auth0UserInfo, IAuth0Service } from 'utils/auth0';
import {
  UpdateUserAvatarDto,
  UpdateUserProfileDto,
  UpdateUserStudentCardDto,
  VerifyEmailDto,
} from '../resources/dto';
import {
  createCamelCaseFromObject,
  createSnakeCaseFromObject,
} from 'utils/request';
import { UserResponse } from '../resources/response';

export const IUserService = 'IUserService';
export interface IUserService {
  sendVerificationEmail(
    user: UserResponse,
    verifyEmailDto: VerifyEmailDto,
  ): Promise<void>;
  updateUserProfile(
    user: UserResponse,
    updateUserProfile: UpdateUserProfileDto,
  ): Promise<UserResponse>;
  updateUserAvatar(
    user: UserResponse,
    updateUserAvatar: UpdateUserAvatarDto,
  ): Promise<UserResponse>;
  updateUserStudentCard(
    user: UserResponse,
    updateUserStudentCard: UpdateUserStudentCardDto,
  ): Promise<UserResponse>;
}

@Injectable()
export class UserService implements IUserService {
  private readonly _auth0Client: AxiosInstance;
  constructor(
    @Inject(IAuth0Service) private readonly _auth0Service: IAuth0Service,
    @Inject(Auth0ModuleOptions) auth0Options: Auth0ModuleOptions,
  ) {
    this._auth0Client = axios.create({
      baseURL: auth0Options.api.baseUrl,
    });
  }
  async sendVerificationEmail(
    user: UserResponse,
    _: VerifyEmailDto,
  ): Promise<void> {
    const token = await this._getToken();
    const { identities, ...payload } = user;
    const verifyEmailPayload = {
      ...createSnakeCaseFromObject(payload),
      identities: createSnakeCaseFromObject(identities),
    };
    await this._sendVerificationEmail(token, verifyEmailPayload);
  }

  async updateUserProfile(
    user: UserResponse,
    updateUserProfile: UpdateUserProfileDto,
  ): Promise<UserResponse> {
    const token = await this._getToken();

    const _user = await this._updateUser(token, {
      ...updateUserProfile,
      userId: user.userId,
    });

    return _user;
  }

  async updateUserAvatar(
    user: UserResponse,
    updateUserAvatar: UpdateUserAvatarDto,
  ): Promise<UserResponse> {
    const token = await this._getToken();

    const _user = await this._updateUser(token, {
      ...updateUserAvatar,
      userId: user.userId,
    });

    return _user;
  }

  async updateUserStudentCard(
    user: UserResponse,
    updateUserStudentCard: UpdateUserStudentCardDto,
  ): Promise<UserResponse> {
    const token = await this._getToken();

    const _user = await this._updateUser(token, {
      ...updateUserStudentCard,
      userId: user.userId,
    });

    return _user;
  }

  private async _getToken() {
    const { access_token } = await this._auth0Service.signToken();
    return access_token;
  }

  private async _sendVerificationEmail(
    token: string,
    verifyEmailDto: VerifyEmailDto,
  ) {
    await this._auth0Client.post(
      '/api/v2/jobs/verification-email',
      createSnakeCaseFromObject(verifyEmailDto),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  }

  private async _updateUser<T extends { userId: string }>(
    token: string,
    updateUser: T,
  ): Promise<UserResponse> {
    const res = await this._auth0Client.post(
      `/api/v2/users/${updateUser.userId}`,
      createSnakeCaseFromObject(updateUser),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return createCamelCaseFromObject<Auth0UserInfo, UserResponse>(res.data);
  }
}
