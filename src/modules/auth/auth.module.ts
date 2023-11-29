import { Module } from '@nestjs/common';
import { Auth0Module, Auth0ModuleOptions } from 'utils/auth0';
import { AuthController } from './controllers';
import { AuthService, IAuthService } from './services';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    Auth0Module.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const auth0Options = configService.get<Auth0ModuleOptions>('auth0');
        return auth0Options;
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: IAuthService,
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
