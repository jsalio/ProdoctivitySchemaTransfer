import { ConnectionProfile } from '../../../types/models/ConnectionProfile';
import { ProfileFilterStrategy } from './ProfileFilterStrategy';

export class CloudProfileFilterStrategy implements ProfileFilterStrategy {
  filter(profiles: ConnectionProfile[]) {
    return profiles
      .filter((x) => x.credential.store === 'Cloud')
      .map((x) => ({
        label: x.name,
        value: x,
      }));
  }
}
