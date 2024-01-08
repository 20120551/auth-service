import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { jwtDecode } from 'jwt-decode';
import { UserResponse } from 'modules/user/resources/response';
import { map } from 'rxjs';
import { PrismaService } from 'utils/prisma';

@Injectable()
export class UpsertSnapshotUserInterceptor implements NestInterceptor {
  constructor(private readonly _prismaService: PrismaService) {}

  async intercept(_: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map(async (resp) => {
        let user = null;
        console.log(resp);
        if (resp?.idToken) {
          user = jwtDecode(resp.idToken) as any as UserResponse;
        } else {
          user = resp;
        }

        if (!user?.userId) {
          return resp;
        }

        await this._prismaService.user.upsert({
          where: {
            id: user.userId,
          },
          create: {
            id: user.sub || user.userId,
            email: user.email,
            name: user.name,
            picture: user.picture || '',
          },
          update: {
            name: user.name,
            picture: user.picture,
          },
        });
        return resp;
      }),
    );
  }
}
