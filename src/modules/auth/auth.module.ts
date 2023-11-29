import { Module } from '@nestjs/common';
import { AuthController } from './controllers';
import { AuthService, IAuthService } from './services';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: IAuthService,
      useClass: AuthService,
    },
  ],
})
export class AuthModule {}
