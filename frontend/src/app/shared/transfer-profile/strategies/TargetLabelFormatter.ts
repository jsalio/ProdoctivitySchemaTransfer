import { ConnectionProfile } from '../../../types/models/ConnectionProfile';
import { LabelFormatterStrategy } from './LabelFormatterStrategy';

export class TargetLabelFormatter implements LabelFormatterStrategy {
  format(profile: ConnectionProfile | undefined): string {
    if (!profile) {
      return '';
    }
    return `Server: ${profile.credential.serverInformation.server} - Usuario: ${profile.credential.username}`;
  }
}
