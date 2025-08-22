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
    keywords: {
        /** Internal name of the keyword (used in code) */
        name: string;
        
        /** Display label for the keyword (shown in UI) */
        label: string;
        
        /** Data type of the keyword value (e.g., 'string', 'number', 'date') */
        dataType: string;
        
        /** Whether this keyword is required for documents of this type */
        require: boolean;
    };
}
