import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from 'modules/auth/auth.module';
import { auth0, azure, firebase, redis } from './configurations/env.config';
import { Auth0Module, Auth0ModuleOptions } from 'utils/auth0';
import { UserModule } from 'modules/user/user.module';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [auth0, azure, firebase, redis],
    }),
    Auth0Module.forRootAsync({
      global: true,
      useFactory: (configService: ConfigService) => {
        const auth0Options = configService.get<Auth0ModuleOptions>('auth0');
        return auth0Options;
      },
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => {
        const redisOptions = configService.get<RedisClientOptions>('redis');
        const store = await redisStore(redisOptions);
        return { store: store as unknown as CacheStore };
      },
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
