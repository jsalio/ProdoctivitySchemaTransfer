/**
 * Represents additional server connection information required for API authentication
 * and database access.
 */
export type AdditionalInfo = {
    /** Server address or URL for the API endpoint */
    server: string;
    
    /** API key used for authentication */
    apiKey: string;
    
    /** API secret used for secure authentication */
    apiSecret: string;
    
    /** Organization identifier for multi-tenant systems */
    organization: string;
    
    /** Database identifier or name to connect to */
    dataBase: string;
};
