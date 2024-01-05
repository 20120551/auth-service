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
import { Observable, map } from 'rxjs';
import util from 'util';

@Injectable()
export class TokenCachingInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly _cacheManager: Cache,
  ) {}

  intercept(
    _: ExecutionContext,
    next: CallHandler,
  ): Observable<Promise<PairTokenResponse>> {
    return next.handle().pipe(
      map(async (resp) => {
        const { accessToken, refreshToken, idToken, expiresIn } =
          util.types.isPromise(resp) ? await resp : resp;
        const user = jwtDecode(idToken);
        console.log(
          'cache token with key: ',
          { userId: user.sub, ...user },
          expiresIn,
        );
        await this._cacheManager.set(
          accessToken,
          { userId: user.sub, ...user },
          expiresIn,
        );

        await this._cacheManager.set(
          user.sub,
          { idToken, accessToken },
          expiresIn,
        );
        return {
          accessToken,
          refreshToken,
          expiresIn,
        };
      }),
    );
  }
}
