import { SchemaKeyword } from "./SchemaKeyword";

/**
 * Defines the schema for a document type, including its structure
 * and the metadata fields (keywords) that documents of this type should contain.
 */
export interface SchemaDocumentType {
    /** Name of the document schema */
    name: string;
    
    /** Reference to the document type this schema applies to */
    documentTypeId: string;
    
    /** Collection of metadata fields (keywords) for this document type */
    keywords: SchemaKeyword[];
}