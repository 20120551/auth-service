import { Module } from '@nestjs/common';
import { UserController } from './controllers';
import { UserService, IUserService } from './services';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: IUserService,
      useClass: UserService,
    },
  ],
})
export class UserModule {}
