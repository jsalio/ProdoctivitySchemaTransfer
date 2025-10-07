import { ConnectionProfile } from '../../../types/models/ConnectionProfile';

export interface LabelFormatterStrategy {
  format(profile: ConnectionProfile | undefined): string;
}
