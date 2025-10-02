/**
 * Additional information required to connect to a ProDoctivity API server.
 * This information is used to authenticate and authorize the connection.
 */
export interface AdditionalInfo {
  /** Base URL or host of the ProDoctivity API server */
  server: string;
  /** Public API key used to authenticate against the server */
  apiKey: string;
  /** Secret associated with the API key */
  apiSecret: string;
  /** Tenant or organization identifier within the server */
  organization: string;
  /** Logical database or environment name to connect to */
  dataBase: string;
}
