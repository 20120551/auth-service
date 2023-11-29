import { ModuleMetadata, Provider, Type } from '@nestjs/common';

export const AzureInstance = 'AzureInstance';
export const AzureModuleOptions = 'AzureModuleOptions';
export interface AzureModuleOptions {
  key: string;
  endpoint: string;
  ocrModel: string;
}

export interface AzureOptionsFactory {
  createAzureOptions(): Promise<AzureModuleOptions> | AzureModuleOptions;
}

export interface AzureModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  global?: boolean;
  useFactory?: (
    ...args: any[]
  ) => Promise<AzureModuleOptions> | AzureModuleOptions;
  inject?: any[];
  useExisting?: Type<AzureOptionsFactory>;
  useClass?: Type<AzureOptionsFactory>;
  providers?: Provider[];
}

export interface AzureOcrStudentCardResponse {
  name: string;
  birthday: string;
  degree: string;
  student_id: string;
  card_expiration: string;
  department: string;
  university_name: string;
}

export * from './azure.module';
export * from './azure.ocr.service';
