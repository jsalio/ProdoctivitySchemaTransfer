import { Credentials } from "./Credentials";

/**
 * Request object for creating a data element.
 * @property {Credentials} credentials - The authentication credentials for the Prodoctivity API.
 * @property {Object} createDataElementRequest - The request object for creating a data element.
 * @property {string} createDataElementRequest.name - The name of the data element.
 * @property {string} createDataElementRequest.dataType - The data type of the data element.
 * @property {boolean} createDataElementRequest.isRequired - Whether the data element is required.
 */
export type CreateDataElementRequest = { 
    /**
     * The authentication credentials for the Prodoctivity API.
     */
    credentials: Credentials, 
    /**
     * The request object for creating a data element.
     */
    createDataElementRequest: { 
        /**
         * The name of the data element.
         */
        name: string,
        /**
         * The data type of the data element.
         */
        dataType: string, 
        /**
         * Whether the data element is required.
         */
        isRequired: boolean
    } 
}