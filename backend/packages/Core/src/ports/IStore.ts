import { Credentials } from "../domain/Credentials";
import { DataElement } from "../domain/DataElement";
import { DocumentGroup } from "../domain/DocumentGroup";
import { DocumentType } from "../domain/DocumentType";
import { SchemaDocumentType } from "../domain/SchemaDocumentType";
import { Result } from "./Result";

/**
 * Core interface defining the contract for data store implementations that handle document management
 * and authentication within the Prodoctivity system.
 * 
 * This interface serves as the foundation for different store implementations, providing a consistent
 * API for document handling, authentication, and data element management across the application.
 */
export interface IStore {
    /**
     * Authenticates a user with the provided credentials.
     * @param credentials - The authentication credentials containing user identification and secret.
     * @returns A Promise that resolves to a Result containing either:
     *          - Success: A string representing the authentication token or session ID.
     *          - Failure: An Error object with details about the authentication failure.
     */
    login(credentials: Credentials): Promise<Result<string, Error>>;

    /**
     * Retrieves all document groups accessible with the provided credentials.
     * @param credential - The authentication credentials for the request.
     * @returns A Promise that resolves to a Result containing either:
     *          - Success: A Set of DocumentGroup objects representing document categories.
     *          - Failure: An Error object if the request fails.
     */
    getDocumentGroups(credential: Credentials): Promise<Result<Array<DocumentGroup>, Error>>;

    /**
     * Retrieves all document types within a specific document group.
     * @param credential - The authentication credentials for the request.
     * @param documentGroupId - The unique identifier of the document group.
     * @returns A Promise that resolves to a Result containing either:
     *          - Success: A Set of DocumentType objects in the specified group.
     *          - Failure: An Error object if the request fails or group is not found.
     */
    getDocumentTypeInGroup(credential: Credentials, documentGroupId: string): Promise<Result<Array<DocumentType>, Error>>;

    /**
     * Retrieves the schema definition for a specific document type.
     * @param credential - The authentication credentials for the request.
     * @param documentTypeId - The unique identifier of the document type.
     * @returns A Promise that resolves to a Result containing either:
     *          - Success: A SchemaDocumentType object with the document structure definition.
     *          - Failure: An Error object if the schema cannot be retrieved.
     */
    getDocumentTypeSchema(credential: Credentials, documentTypeId: string): Promise<Result<SchemaDocumentType, Error>>;

    /**
     * Retrieves all available data elements in the system.
     * @param credential - The authentication credentials for the request.
     * @returns A Promise that resolves to a Result containing either:
     *          - Success: A Set of DataElement objects.
     *          - Failure: An Error object if the request fails.
     */
    getDataElements: (credential: Credentials) => Promise<Result<Array<DataElement>, Error>>;

    /**
     * Creates a new document group with the specified name.
     * @param credential - The authentication credentials with appropriate permissions.
     * @param name - The name for the new document group. Must be unique.
     * @returns A Promise that resolves to a Result containing either:
     *          - Success: The created DocumentGroup object.
     *          - Failure: An Error object if creation fails.
     * @optional
     */
    createDocumentGroup?: (credential: Credentials, name: string) => Promise<Result<DocumentGroup, Error>>;

    /**
     * Creates a new document type within the system.
     * @param credential - The authentication credentials with appropriate permissions.
     * @param createDocumentTypeRequest - The document type configuration:
     *   - name: The unique name of the document type.
     *   - businessFunctionId: The ID of the associated business function.
     * @returns A Promise that resolves to a Result containing either:
     *          - Success: The created DocumentType object.
     *          - Failure: An Error object if creation fails.
     * @optional
     */
    createDocumentType?: (credential: Credentials, createDocumentTypeRequest: {
        name: string,
        businessFunctionId: string,  // Fixed typo from 'buseinessFunctionId'
    }) => Promise<Result<DocumentType, Error>>;

    /**
     * Creates a new data element definition.
     * @param credential - The authentication credentials with appropriate permissions.
     * @param createDataElementRequest - The data element configuration:
     *   - name: The unique name of the data element.
     *   - documentTypeId: The ID of the associated document type.
     *   - dataType: The data type (e.g., 'string', 'number', 'date').
     *   - required: Whether this field is mandatory in the document.
     * @returns A Promise that resolves to a Result containing either:
     *          - Success: The created DataElement object.
     *          - Failure: An Error object if creation fails.
     * @optional
     */
    createDataElement?: (credential: Credentials, createDataElementRequest: {
        name: string,
        documentTypeId: string,
        dataType: string,
        required: boolean,  // Changed from 'require' to 'required' for consistency
    }) => Promise<Result<DataElement, Error>>;

    /**
     * Assigns a data element to a document type with a specific order.
     * @param credential - The authentication credentials with appropriate permissions.
     * @param assignDataElementToDocumentTypeRequest - The assignment details:
     *   - documentTypeId: The target document type ID.
     *   - dataElement: The data element configuration:
     *     - name: The name of the data element to assign.
     *     - order: The display/processing order within the document type.
     * @returns A Promise that resolves to a Result containing either:
     *          - Success: true if assignment was successful.
     *          - Failure: An Error object if assignment fails.
     * @optional
     */
    assignDataElementToDocumentType?: (credential: Credentials, assignDataElementToDocumentTypeRequest: {
        documentTypeId: string,
        dataElement: {
            name: string,
            order: number,
        },
    }) => Promise<Result<boolean, Error>>;

    /**
     * Retrieves the name/identifier of the store implementation.
     * @returns A string representing the store's name, useful for logging and debugging.
     */
    getStoreName: () => string;
}