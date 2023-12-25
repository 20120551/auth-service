import { Inject, Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { Auth0ModuleOptions, Auth0UserInfo, IAuth0Service } from 'utils/auth0';
import {
  LogoutDto,
  UpdateUserAvatarDto,
  UpdateUserProfileDto,
  VerifyEmailDto,
} from '../resources/dto';
import {
  createCamelCaseFromObject,
  createSnakeCaseFromObject,
} from 'utils/request';
import { UserResponse } from '../resources/response';
import { IFirebaseStorageService } from 'utils/firebase';
import { ChangePasswordDto } from '../resources/dto/changePassword.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

export const IUserService = 'IUserService';
export interface IUserService {
  getUserProfile(user: UserResponse): Promise<UserResponse>;
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
  changePassword(
    user: UserResponse,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void>;
  logout(user: UserResponse, logoutDto: LogoutDto): Promise<void>;
}

@Injectable()
export class UserService implements IUserService {
  private readonly _auth0Client: AxiosInstance;
  constructor(
    @Inject(IAuth0Service)
    private readonly _auth0Service: IAuth0Service,
    @Inject(IFirebaseStorageService)
    private readonly _firebaseStorageService: IFirebaseStorageService,
    @Inject(Auth0ModuleOptions)
    _auth0Options: Auth0ModuleOptions,
    @Inject(CACHE_MANAGER) private readonly _cacheManager: Cache,
  ) {
    this._auth0Client = axios.create({
      baseURL: _auth0Options.baseUrl,
    });
  }

  async logout(user: UserResponse, logoutDto: LogoutDto): Promise<void> {
    const { idToken } = user.userMetadata;
    await this._auth0Client.post('oidc/logout', {
      ...createSnakeCaseFromObject({
        ...logoutDto,
        idTokenHint: idToken,
      }),
    });
    await this._cacheManager.del(user.userId);
  }

  async changePassword(
    user: UserResponse,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const token = await this._getToken();
    await this._updateUser(token, {
      ...changePasswordDto,
      userId: user.userId,
    });
  }

  async getUserProfile(user: UserResponse): Promise<UserResponse> {
    const token = await this._getToken();
    const res = await this._auth0Client.get(`/api/v2/users/${user.userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return createCamelCaseFromObject<Auth0UserInfo, UserResponse>(res.data);
  }
  async sendVerificationEmail(
    user: UserResponse,
    _: VerifyEmailDto,
  ): Promise<void> {
    const token = await this._getToken();
    const [provider, userId] = user.userId.split('|');
    const verifyEmailPayload = {
      userId: user.userId,
      identity: {
        userId,
        provider,
      },
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
    const { buffer, filename } = updateUserAvatar;
    const cardBucket = `avatar/${filename}`;
    await this._firebaseStorageService.upload(buffer, cardBucket);
    const url = await this._firebaseStorageService.get(cardBucket);

    const token = await this._getToken();

    const _user = await this._updateUser(token, {
      picture: url,
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
