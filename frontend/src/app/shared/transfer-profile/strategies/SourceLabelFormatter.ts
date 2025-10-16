import { ConnectionProfile } from '../../../types/models/ConnectionProfile';
import { LabelFormatterStrategy } from './LabelFormatterStrategy';

export class SourceLabelFormatter implements LabelFormatterStrategy {
  format(profile: ConnectionProfile | undefined): string {
    if (!profile) {
      return '';
    }
    return `Server: ${profile.credential.serverInformation.server} - Orgnanizacion: ${profile.credential.serverInformation.organization} - Usuario: ${profile.credential.username}`;
  }
}
