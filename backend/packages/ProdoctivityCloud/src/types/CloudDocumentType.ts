
/**
 * Represents a document type in the cloud, containing essential metadata
 * for identifying and categorizing documents within the system.
 */
export interface CloudDocumentType {
    /** Version identifier of the document type */
    documentTypeVersionId: string;
    
    /** Unique identifier of the document type */
    documentTypeId: string;
    
    /** Identifier of the document group this type belongs to */
    documentGroupId: string;
    
    /** Name of the document group this type belongs to */
    documentGroupName: string;
    
    /** Human-readable name of the document type */
    name: string;
    
    /** List of MIME types accepted for this document type */
    acceptedMimeTypeList: string[];
    
    /** Optional version identifier of the associated template */
    templateVersionId?: string;
    
    /** Optional identifier of the associated template */
    templateId?: string;
}
