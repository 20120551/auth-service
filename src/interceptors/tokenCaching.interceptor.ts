import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { jwtDecode } from 'jwt-decode';
import { PairTokenResponse } from 'modules/auth/resources/response';
import { UserResponse } from 'modules/user/resources/response';
import { Observable, map } from 'rxjs';
import util from 'util';
import { Auth0UserInfo, IAuth0Service } from 'utils/auth0';
import { createCamelCaseFromObject } from 'utils/request';

@Injectable()
export class TokenCachingInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly _cacheManager: Cache,
    @Inject(IAuth0Service)
    private readonly _auth0Service: IAuth0Service,
  ) {}

  intercept(
    _: ExecutionContext,
    next: CallHandler,
  ): Observable<Promise<PairTokenResponse>> {
    return next.handle().pipe(
      map(async (resp) => {
        const { accessToken, refreshToken, idToken, expiresIn } =
          util.types.isPromise(resp) ? await resp : resp;
        const cacheUser = await this._auth0Service.verifyToken(
          accessToken,
          jwtDecode(idToken).sub,
        );

        const user = createCamelCaseFromObject<Auth0UserInfo, UserResponse>(
          cacheUser,
        );

        console.log('cache token with key: ', user, expiresIn);
        await this._cacheManager.set(accessToken, user, expiresIn);
        await this._cacheManager.set(user.userId, { accessToken }, expiresIn);

        return {
          accessToken,
          refreshToken,
          expiresIn,
          user,
        };
      }),
    );
  }
}
