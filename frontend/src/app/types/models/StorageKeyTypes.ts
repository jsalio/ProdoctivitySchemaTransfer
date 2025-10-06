// import { TranferProfiles } from './constants';
import { Credentials } from './Credentials';
import { TransferProfile } from './TransferProfile';

export interface StorageKeyTypes {
  Profiles: { name: string; credential: Credentials }[]; // Reemplaza 'any' con el tipo real de Profiles
  Credentials_V5_V5: Credentials; // Reemplaza 'any' con el tipo real de Credentials_V5_V5
  Credentials_V6_Cloud: Credentials; // Reemplaza 'any' con el tipo real de Credentials_V6_Cloud
  ConnectionProfiles: TransferProfile[];
  [key: string]: unknown; // Para otras claves genéricas
}
