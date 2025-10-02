import { Credentials } from './Credentials';

/**
 * Represents a saved connection profile the user can select to connect
 * to a ProDoctivity backend.
 */
export interface ConnectionProfile {
  /** Whether this profile is the default selection */
  default: boolean;
  /** Friendly name shown in the UI for the profile */
  name: string;
  /** Credentials and server details used by this profile */
  credential: Credentials;
}
