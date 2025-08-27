// Import the Credentials model, which likely defines the structure for authentication credentials.
import { Credentials } from "../models/Credentials";
// Import Observable from RxJS, used for handling asynchronous data streams.
import { Observable } from "rxjs";
import { DocumentType } from "../models/SchemaDocumentType";

// Defines the structure of a DocumentGroup object, representing a group of documents.
export type DocumentGroup = {
    /** Unique identifier for the document group. */
    groupId: string;
    /** Name of the document group. */
    groupName: string;
    /** Number of document types within the group. */
    documentTypesCounter: number;
};

export interface DataElement {
    id: string,
    name: string,
    dataType: string
    required: string
}

export type Response<T> = {
    success: boolean,
    data: T,
}

// Interface defining methods for interacting with document-related data via asynchronous operations.
export interface ISchema {
    /**
     * Retrieves a list of document groups based on provided credentials.
     * @param credentials - The authentication credentials required for the request.
     * @returns An Observable emitting an object containing an array of DocumentGroup objects and a success flag.
     */
    getDocumentGruops: (credetials: Credentials) => Observable<{
        /** Array of document groups. */
        data: Array<DocumentGroup>;
        /** Indicates whether the request was successful. */
        success: boolean;
    }>;

    /**
     * Retrieves document types within a specific group based on provided credentials and group ID.
     * @param credentials - The authentication credentials required for the request.
     * @param groupId - The unique identifier of the document group.
     * @returns An Observable emitting an object containing an array of document types and a success flag.
     */
    getDocumentTypesInGroup: (credentials: Credentials, groupId: string) => Observable<{
        /** Array of document types within the specified group. */
        data: Array<any>;
        /** Indicates whether the request was successful. */
        success: boolean;
    }>;

    /**
     * Retrieves the schema for a specific document type based on provided credentials and document type ID.
     * @param credentials - The authentication credentials required for the request.
     * @param documentTypeId - The unique identifier of the document type.
     * @returns An Observable emitting an object containing the schema data for the document type and a success flag.
     */
    getDocumentTypeSchema: (credentials: Credentials, documentTypeId: string) => Observable<{
        /** Array of schema data for the specified document type. */
        data: Array<any>;
        /** Indicates whether the request was successful. */
        success: boolean;
    }>;

    /**
     * Retrieves all data elements based on provided credentials.
     * @param credentials - The authentication credentials required for the request.
     * @returns An Observable emitting an object containing an array of all data elements and a success flag.
     */
    getAllDataElements: (credetials: Credentials) => Observable<{
        /** Array of all data elements. */
        data: Array<DataElement>;
        /** Indicates whether the request was successful. */
        success: boolean;
    }>;

    /**
     * Creates a new document group based on provided credentials and group structure.
     * @param credentials - The authentication credentials required for the request.
     * @param groupStruct - The structure of the document group to be created.
     * @returns An Observable emitting an object containing the created document group and a success flag.
     */
    saveNewDocumentGroup: (credentials: Credentials, groupStruct: { name: string }) => Observable<Response<DocumentGroup>>

    saveNewDocumentType: (credentials: Credentials, documentTypeStruct: { name: string, documentGroupId: string }) => Observable<Response<DocumentType>>
    saveNewKeyword: (credentials: Credentials, keywordStruct: { name: string, dataType: string, required: string, label: string }) => Observable<any>
    saveNewDocumentSchema: (
        credentials: Credentials,
        documentSchemaStruct: {
            name: string,
            documentTypeId: string,
            keywordId: string
        }
    ) => Observable<any>
}