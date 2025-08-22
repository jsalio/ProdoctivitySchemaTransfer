/**
 * Represents a group of related document types in the system.
 * Used for organizing and categorizing different types of documents.
 */
export type DocumentGroup = {
    /** Unique identifier for the document group */
    groupId: string;
    
    /** Display name of the document group */
    groupName: string;
    
    /** Number of document types contained within this group */
    documentTypesCounter: number;
};