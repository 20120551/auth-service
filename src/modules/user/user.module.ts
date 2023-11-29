import { Module } from '@nestjs/common';
import { UserController } from './controllers';
import { UserService, IUserService } from './services';
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
  controllers: [UserController],
  providers: [
    {
      provide: IUserService,
      useClass: UserService,
    },
  ],
})
export class UserModule {}
