import { ValidationArguments, registerDecorator } from 'class-validator';
import { env } from 'process';

type DefaultValueOptions = { fromEnv: boolean };
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
