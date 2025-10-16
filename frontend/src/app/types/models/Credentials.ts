import { AdditionalInfo } from './AdditionalInfo';
/**
 * Authentication credentials and server information used to establish
 * a session with the ProDoctivity backend.
 */
export interface Credentials {
  /** Username for login */
  username: string;
  /** Password for login */
  password: string;
  /** Server and organization details */
  serverInformation: AdditionalInfo;
  /** Optional store variant (e.g., ProDoctivity 5 or Cloud) */
  store?: string;
  /** Optional session or API token once authenticated */
  token?: string;
}
