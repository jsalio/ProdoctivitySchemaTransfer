import { ConnectionProfile } from '../../../types/models/ConnectionProfile';

export interface ProfileFilterStrategy {
  filter(profiles: ConnectionProfile[]): { label: string; value: ConnectionProfile }[];
}
