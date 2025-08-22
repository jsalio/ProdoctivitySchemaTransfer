/**
 * Represents a specific type of document in the system.
 * Each document type defines a category of documents with similar characteristics.
 */
export interface DocumentType {
    /** Unique identifier for the document type */
    documentTypeId: string;
    
    /** Human-readable name of the document type */
    documentTypeName: string;
}
