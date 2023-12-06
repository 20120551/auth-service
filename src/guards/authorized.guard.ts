import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { Auth0UserInfo, IAuth0Service } from 'utils/auth0';
import {
  ForbiddenException,
  UnauthorizedException,
} from 'utils/errors/domain.error';
import { Reflector } from '@nestjs/core';
import { createCamelCaseFromObject } from 'utils/request';
import { UserResponse } from 'modules/user/resources/response';
import { Request } from 'express';

import { SetMetadata } from '@nestjs/common';
import {
  POLICIES_KEY,
  ROLES_KEY,
  SupportedRole,
} from 'configurations/role.config';

export const Roles = (...roles: any[]) => SetMetadata(ROLES_KEY, roles);
export const Policies = (...polices: any[]) =>
  SetMetadata(POLICIES_KEY, polices);

@Injectable()
export class AuthorizedGuard implements CanActivate {
  constructor(
    @Inject(IAuth0Service) private readonly _auth0Service: IAuth0Service,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
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

      const camelCase = createCamelCaseFromObject<Auth0UserInfo, UserResponse>(
        userInfo,
      );
      request.user = {
        ...camelCase,
        userId: camelCase['sub'],
      };
    }

    const requiredRoles = this.reflector.getAllAndOverride<any[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = request;
    const isAcceptedRole = requiredRoles.some(
      (role) => user.appMetadata[role] !== undefined,
    );

    if (!isAcceptedRole) {
      throw new ForbiddenException(
        'Do not have permission to access the resource',
      );
    }

    return true;
  }
}

export interface UseAuthorizeOptions {
  policies?: {
    [index: string]: string;
  };
  roles?: SupportedRole[];
}
export const UseAuthorized = (
  options: UseAuthorizeOptions,
): ClassDecorator & MethodDecorator => {
  return (target: Function, prop?: string, descriptor?: PropertyDescriptor) => {
    Roles(options.roles)(target, prop, descriptor);
    Policies(options.policies)(target, prop, descriptor);
    UseGuards(AuthorizedGuard)(target, prop, descriptor);
  };
};
