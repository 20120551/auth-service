import { DynamicModule, Module, Provider } from '@nestjs/common';
import { initializeApp } from 'firebase/app';
import {
  FirebaseInstance,
  FirebaseModuleAsyncOptions,
  FirebaseModuleOptions,
  IFirebaseStorageService,
} from '.';
import { FirebaseStorageService } from './firebase.storage.service';

@Module({
  providers: [
    {
      provide: IFirebaseStorageService,
      useClass: FirebaseStorageService,
    },
  ],
  exports: [IFirebaseStorageService],
})
export class FirebaseModule {
  static forRoot(options: FirebaseModuleOptions): DynamicModule {
    const app = initializeApp(options);
    return {
      module: FirebaseModule,
      providers: [
        {
          provide: FirebaseInstance,
          useExisting: app,
        },
      ],
    };
  }

  static forRootAsync(options: FirebaseModuleAsyncOptions): DynamicModule {
    return {
      global: options.global || false,
      module: FirebaseModule,
      providers: [
        ...this.createAsyncProvider(options),
        ...(options.providers || []),
      ],
      imports: options.imports,
    };
  }

  private static createAsyncProvider(
    options: FirebaseModuleAsyncOptions,
  ): Provider[] {
    const result = [];
    if (options.useFactory) {
      result.push({
        provide: FirebaseInstance,
        useFactory: options.useFactory,
        inject: options.inject || [],
      });
    }

    if (options.useClass) {
      result.push({
        provide: FirebaseInstance,
        useClass: options.useClass,
      });
    }

    if (options.useExisting) {
      result.push({
        provide: FirebaseInstance,
        useExisting: options.useExisting,
      });
    }

    return result;
  }
}
