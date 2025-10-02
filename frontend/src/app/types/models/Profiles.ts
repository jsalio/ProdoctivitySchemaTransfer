/**
 * Describes a stored profile shown in the profiles table and used for connections.
 */
export interface Profiles {
  /** Profile display name */
  name: string;
  /** User account associated to this profile */
  accountName: string;
  /** Backend type */
  store: 'ProDoctivity 5' | 'ProDoctivity Cloud';
  /** Organization/tenant name */
  organization: string;
  /** Server host or URL */
  server: string;
  /** Whether the profile is the default one */
  default: boolean;
}
