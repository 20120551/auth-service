import { ModuleMetadata, Provider, Type } from '@nestjs/common';

// OPTION //
export const Auth0ModuleOptions = 'Auth0ModuleOptions';
export interface Auth0ModuleOptions {
  clientId: string;
  clientSecret: string;
  baseUrl: string;
}

export interface Auth0OptionsFactory {
  createAuth0Options(): Promise<Auth0ModuleOptions> | Auth0ModuleOptions;
}

export interface Auth0ModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  global?: boolean;
  useFactory?: (
    ...args: any[]
  ) => Promise<Auth0ModuleOptions> | Auth0ModuleOptions;
  inject?: any[];
  useExisting?: Type<Auth0OptionsFactory>;
  useClass?: Type<Auth0OptionsFactory>;
  providers?: Provider[];
}

// TOKEN //
export interface Auth0AccessToken {
  access_token: string;
}

export interface Auth0PairToken extends Auth0AccessToken {
  refresh_token: string;
}

export interface Auth0ClientCredentialTokenOptions {
  grant_type: string;
  client_id: string;
  client_secret: string;
  audience: string;
}

export interface Auth0UserIdentity {
  user_id: string;
  provider: string;
  connection: string;
  isSocial: boolean;
}

export interface Auth0UserMetadata {
  student_card?: string;
}
export interface Auth0AppMetadata {}

export interface Auth0UserInfo {
  email: string;
  email_verified: boolean;
  identities: Auth0UserIdentity;
  name: string;
  nickname: string;
  picture: string;
  user_id: string;
  user_metadata: Auth0UserMetadata;
  app_metadata: Auth0AppMetadata;
}
export * from './auth0.service';
export * from './auth0.module';
