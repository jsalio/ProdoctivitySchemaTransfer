import { Credentials } from "../domain/Credentials";
import { DataElement } from "../domain/DataElement";
import { DocumentGroup } from "../domain/DocumentGroup";
import { DocumentType } from "../domain/DocumentType";
import { SchemaDocumentType } from "../domain/SchemaDocumentType";

/**
 * Interface defining methods for interacting with a data store, handling authentication and document-related operations.
 */
export interface IStore {
    /**
     * Authenticates a user with the provided credentials and returns a token or session identifier.
     * @param credentials - The authentication credentials required for login.
     * @returns A Promise resolving to a string representing the authentication token or session ID.
     */
    login(credentials: Credentials): Promise<string>;

    /**
     * Retrieves a set of document groups based on the provided credentials.
     * @param credential - The authentication credentials required for the request.
     * @returns A Promise resolving to a Set of DocumentGroup objects.
     */
    getDocumentGroups(credential: Credentials): Promise<Set<DocumentGroup>>;

    /**
     * Retrieves a set of document types within a specific document group.
     * @param credential - The authentication credentials required for the request.
     * @param documentGroupId - The unique identifier of the document group.
     * @returns A Promise resolving to a Set of DocumentType objects.
     */
    getDocumentTypeInGroup(credential: Credentials, documentGroupId: string): Promise<Set<DocumentType>>;

    /**
     * Retrieves the schema for a specific document type.
     * @param credential - The authentication credentials required for the request.
     * @param documentTypeId - The unique identifier of the document type.
     * @returns A Promise resolving to a SchemaDocumentType object.
     */
    getDocumentTypeSchema(credential: Credentials, documentTypeId: string): Promise<SchemaDocumentType>;

    /**
     * Retrieves a set of all data elements based on the provided credentials.
     * @param credential - The authentication credentials required for the request.
     * @returns A Promise resolving to a Set of DataElement objects.
     */
    getDataElements: (credential: Credentials) => Promise<Set<DataElement>>;

    /**
     * Retrieves the name of the store.
     * @returns A string representing the name of the store.
     */
    getStoreName: () => string;
}