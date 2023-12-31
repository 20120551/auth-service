import { Module } from '@nestjs/common';
import { AdminController, UserController } from './controllers';
import {
  UserService,
  IUserService,
  IAdminService,
  AdminService,
} from './services';
import { AzureModule, AzureModuleOptions } from 'utils/ocr/azure';
import { ConfigService } from '@nestjs/config';
import { FirebaseModule, FirebaseModuleOptions } from 'utils/firebase';

@Module({
  imports: [
    AzureModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const azure = configService.get<AzureModuleOptions>('azure');
        return azure;
      },
      inject: [ConfigService],
    }),
    FirebaseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const firebase = configService.get<FirebaseModuleOptions>('firebase');
        return firebase;
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController, AdminController],
  providers: [
    {
      provide: IUserService,
      useClass: UserService,
    },
    {
      provide: IAdminService,
      useClass: AdminService,
    },
  ],
})
export class UserModule {}
