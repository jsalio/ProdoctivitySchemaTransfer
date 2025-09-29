import { AdditionalInfo } from './AdditionalInfo';
export interface Credentials {
  username: string;
  password: string;
  serverInformation: AdditionalInfo;
  store?: string;
  token?: string;
}
