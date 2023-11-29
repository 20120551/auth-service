import { ClientCredential } from './clientCredential.dto';

export class UpdateUserProfileDto extends ClientCredential {
  givenName: string;
  familyName: string;
  name: string;
  nickname: string;
}
