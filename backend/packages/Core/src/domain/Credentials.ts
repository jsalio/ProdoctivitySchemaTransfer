import { AdditionalInfo } from "./AdditionalInformation";

/**
 * Represents user credentials and authentication information required
 * to access the system's API and services.
 */
export type Credentials = {
    /** The username for authentication */
    username: string;
    
    /** The password for authentication */
    password: string;
    
    /** Server connection and API configuration details */
    serverInformation: AdditionalInfo;
    
    /** Optional store identifier for multi-store systems */
    store?: string;
    
    /** Optional authentication token for authenticated sessions */
    token?: string;
};
