import { Provider, Type, ModuleMetadata } from '@nestjs/common';
import { initializeApp } from 'firebase/app';

export const FirebaseInstance = 'FirebaseInstance';
export type FirebaseInstance = ReturnType<typeof initializeApp>;
export const IFirebaseStorageService = 'IFirebaseStorageService';

export const FirebaseModuleOptions = 'FirebaseModuleOptions';
export interface FirebaseModuleOptions {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}

export interface FirebaseOptionsFactory {
  createFirebaseOptions():
    | Promise<FirebaseModuleOptions>
    | FirebaseModuleOptions;
}

export interface FirebaseModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  global?: boolean;
  useFactory?: (
    ...args: any[]
  ) => Promise<FirebaseModuleOptions> | FirebaseModuleOptions;
  inject?: any[];
  useExisting?: Type<FirebaseOptionsFactory>;
  useClass?: Type<FirebaseOptionsFactory>;
  providers?: Provider[];
}

export interface IFirebaseStorageService {
  upload(file: ArrayBuffer | Uint8Array, path: string): Promise<void>;
  get(path: string): Promise<string | undefined>;
  del(path: string): Promise<boolean>;
}

export * from './firebase.module';
export * from './firebase.storage.service';
