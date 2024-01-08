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
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from 'utils/prisma';

export const Roles = (...roles: any[]) => SetMetadata(ROLES_KEY, roles);
export const Policies = (...polices: any[]) =>
  SetMetadata(POLICIES_KEY, polices);

@Injectable()
export class AuthorizedGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const requiredRoles = this.reflector.getAllAndOverride<any[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = request;

    const isAcceptedRole = requiredRoles
      .flat()
      .some((_role) => user.userMetadata.role === _role);

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
