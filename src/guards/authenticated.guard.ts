import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Auth0UserInfo, IAuth0Service } from 'utils/auth0';
import { UnauthorizedException } from 'utils/errors/domain.error';
import { createCamelCaseFromObject } from 'utils/request';
import { UserResponse } from 'modules/user/resources/response';
import { Request } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(
    // @Inject(IAuth0Service) private readonly _auth0Service: IAuth0Service,
    @Inject(CACHE_MANAGER) private readonly _cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const token = request.headers.authorization;
    if (!token) {
      throw new UnauthorizedException('Token not appear in request header');
    }

    const accessToken = token.split(' ')[1];
    if (!accessToken) {
      throw new UnauthorizedException('Token stype not supported');
    }

    const userInfo = await this._cacheManager.get<UserResponse>(accessToken);
    if (!userInfo) {
      throw new UnauthorizedException('Invalid Token');
    }

    request.user = userInfo;
    return true;
  }
}
