import { DynamicModule, Module, Provider } from '@nestjs/common';
import { AzureModuleAsyncOptions, AzureModuleOptions } from '.';
import { AzureOcrService, IAzureOcrService } from './azure.ocr.service';

@Module({
  providers: [
    {
      provide: IAzureOcrService,
      useClass: AzureOcrService,
    },
  ],
  exports: [IAzureOcrService],
})
export class AzureModule {
  static forRoot(options: AzureModuleOptions): DynamicModule {
    return {
      module: AzureModule,
      providers: [
        {
          provide: AzureModuleOptions,
          useExisting: options,
        },
      ],
    };
  }

  static forRootAsync(options: AzureModuleAsyncOptions): DynamicModule {
    return {
      global: options.global || false,
      module: AzureModule,
      providers: [
        ...this.createAsyncProvider(options),
        ...(options.providers || []),
      ],
      imports: options.imports,
    };
  }

  private static createAsyncProvider(
    options: AzureModuleAsyncOptions,
  ): Provider[] {
    const result = [];
    if (options.useFactory) {
      result.push({
        provide: AzureModuleOptions,
        useFactory: options.useFactory,
        inject: options.inject || [],
      });
    }

    if (options.useClass) {
      result.push({
        provide: AzureModuleOptions,
        useClass: options.useClass,
      });
    }

    if (options.useExisting) {
      result.push({
        provide: AzureModuleOptions,
        useExisting: options.useExisting,
      });
    }

    return result;
  }
}
