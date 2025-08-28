import { Credentials } from "../domain/Credentials";
import { DataElement } from "../domain/DataElement";
import { DocumentGroup } from "../domain/DocumentGroup";
import { DocumentType } from "../domain/DocumentType";
import { SchemaDocumentType } from "../domain/SchemaDocumentType";
import { Result } from "./Result";

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
     * Creates a new document group with the specified name.
     * @param credential - The authentication credentials required for the request.
     * @param name - The name of the document group to create.
     * @returns A Promise resolving to a Result containing either the created DocumentGroup or an Error.
     */
    createDocumentGroup?: (credential: Credentials, name: string) => Promise<Result<DocumentGroup, Error>>;

    /**
     * Creates a new document type with the specified parameters.
     * @param credential - The authentication credentials required for the request.
     * @param createDocumentTypeRequest - An object containing the document type details:
     *   - name: The name of the document type.
     *   - buseinessFunctionId: The ID of the business function this document type belongs to (note: typo in parameter name).
     * @returns A Promise resolving to a Result containing either the created DocumentType or an Error.
     */
    createDocumentType?: (credential: Credentials, createDocumentTypeRequest: {
        name: string,
        buseinessFunctionId: string,
    }) => Promise<Result<DocumentType, Error>>;

    /**
     * Creates a new data element with the specified parameters.
     * @param credential - The authentication credentials required for the request.
     * @param createDataElementRequest - An object containing the data element details:
     *   - name: The name of the data element.
     *   - documentTypeId: The ID of the document type this data element belongs to.
     *   - dataType: The data type of the element.
     *   - require: Whether this data element is required.
     * @returns A Promise resolving to a Result containing either the created DataElement or an Error.
     */
    createDataElement?: (credential: Credentials, createDataElementRequest: {
        name: string,
        documentTypeId: string,
        dataType: string,
        require: boolean,
    }) => Promise<Result<DataElement, Error>>;

    /**
     * Assigns a data element to a document type with the specified parameters.
     * @param credential - The authentication credentials required for the request.
     * @param assignDataElementToDocumentTypeRequest - An object containing the assignment details:
     *   - documentTypeId: The ID of the document type to assign the data element to.
     *   - dataElement: An object containing the data element details:
     *     - name: The name of the data element to assign.
     *     - order: The position/order of the data element within the document type.
     * @returns A Promise resolving to a Result indicating success or containing an Error.
     */
    assignDataElementToDocumentType?: (credential: Credentials, assignDataElementToDocumentTypeRequest: {
        documentTypeId: string,
        dataElement: {
            name: string,
            order: number,
        },
    }) => Promise<Result<boolean, Error>>;

    /**
    * Retrieves the name of the store.
    * @returns A string representing the name of the store.
    */
    getStoreName: () => string;
}