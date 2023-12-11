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
      map(async ({ accessToken, refreshToken, idToken, expiresIn }) => {
        const { sub } = jwtDecode(idToken);
        console.log('cache token with key: ', sub);
        await this._cacheManager.set(sub, { idToken, accessToken }, expiresIn);
        return {
          accessToken,
          refreshToken,
          expiresIn,
        };
      }),
    );
  }
}
