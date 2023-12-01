import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ValidationArguments, registerDecorator } from 'class-validator';
import { Request } from 'express';
import { env } from 'process';

type DefaultValueOptions = {
  fromEnv?: boolean;
  filter?: (obj: any) => boolean;
};

export function defaultValue<T>(value: T, options?: DefaultValueOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'defaultValue',
      target: object.constructor,
      propertyName: propertyName,
      validator: {
        validate(_value: any, args: ValidationArguments) {
          if (_value) {
            return true;
          }

          if (options?.filter) {
            const isValueAccepted = options.filter(args.object);
            if (isValueAccepted) {
              // pass
            } else {
              return true;
            }
          }

          if (value === undefined) {
            return false;
          }

          let assignValue = value;
          if (options?.fromEnv) {
            assignValue = env[assignValue as string] as T;
          }

          args.object[args.property] = assignValue;
          return true;
        },
      },
    });
  };
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as Request;
    return request.user;
  },
);
