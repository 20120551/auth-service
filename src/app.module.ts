import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from 'modules/auth/auth.module';
import { auth0 } from './configurations/env.config';
import { Auth0Module, Auth0ModuleOptions } from 'utils/auth0';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [auth0],
    }),
    Auth0Module.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const auth0Options = configService.get<Auth0ModuleOptions>('auth0');
        return auth0Options;
      },
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
