import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ForbiddenException } from 'utils/errors/domain.error';
import { RevalidateTokenRespoonse } from 'modules/user/resources/response';

@Injectable()
export class TokenRevalidatingInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly _cacheManager: Cache,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const { user } = request;
    const revalidatedToken =
      await this._cacheManager.get<RevalidateTokenRespoonse>(user.userId);

    if (!revalidatedToken) {
      throw new ForbiddenException('Invalid token');
    }
    const token = request.headers.authorization.split(' ')[1];

    if (revalidatedToken.accessToken !== token) {
      throw new ForbiddenException('Invalid token');
    }

    // attach id token in user request
    request.user['userMetadata']['idToken'] = revalidatedToken.idToken;
    return next.handle();
  }
}
