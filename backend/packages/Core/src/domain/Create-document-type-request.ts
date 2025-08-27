import { Credentials } from "./Credentials";

/**
 * Request object for creating a document type.
 * @property {Credentials} credentials - The authentication credentials for the Prodoctivity API.
 * @property {Object} createDocumentTypeRequest - The request object for creating a document type.
 * @property {string} createDocumentTypeRequest.name - The name of the document type.
 * @property {string} createDocumentTypeRequest.documentGroupId - The ID of the document group to which the document type belongs.
 */
export type CreateDocumentTypeRequest = {
    /**
     * Authentication credentials for the Prodoctivity API.
     */
    credentials: Credentials,
    /**
     * Request object for creating a document type.
     */
    createDocumentTypeRequest: {
        /**
         * Name of the document type.
         */
        name: string,
        /**
         * ID of the document group to which the document type belongs.
         */
        documentGroupId: string
    }
}