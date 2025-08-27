import { Credentials } from "./Credentials";
/**
 * Request object for creating a document group.
 * @property {string} name - The name of the document group.
 * @property {Credentials} credentials - The authentication credentials for the Prodoctivity API.
 */
export type CreateDocumentGroupRequest = {
    /**
     * The name of the document group.
     */
    name: string;
    /**
     * The authentication credentials for the Prodoctivity API.
     */
    credentials: Credentials;
}