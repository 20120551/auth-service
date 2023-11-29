import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { IAuth0Service } from 'utils/auth0';
import { UnauthorizedException } from 'errors/domain.error';
import { ROLES_KEY } from 'utils/decorator/classes';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthorizedGuard implements CanActivate {
  constructor(
    @Inject(IAuth0Service) private readonly _auth0Service: IAuth0Service,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      const token = request.headers.authorization;
      if (!token) {
        throw new UnauthorizedException('Token not appear in request header');
      }

      const accessToken = token.split(' ')[1];
      if (!accessToken) {
        throw new UnauthorizedException('Token style not supported');
      }

      const userInfo = await this._auth0Service.verifyToken({
        access_token: accessToken,
      });

      request.user = userInfo;
    }

    const requiredRoles = this.reflector.getAllAndOverride<any[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = request;
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
