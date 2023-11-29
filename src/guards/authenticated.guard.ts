import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { IAuth0Service } from 'utils/auth0';
import { UnauthorizedException } from 'errors/domain.error';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(
    @Inject(IAuth0Service) private readonly _auth0Service: IAuth0Service,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    if (!token) {
      throw new UnauthorizedException('Token not appear in request header');
    }

    const accessToken = token.split(' ')[1];
    if (!accessToken) {
      throw new UnauthorizedException('Token stype not supported');
    }

    const userInfo = await this._auth0Service.verifyToken({
      access_token: accessToken,
    });

    request.user = userInfo;
    return true;
  }
}
