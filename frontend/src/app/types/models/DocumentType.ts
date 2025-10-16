/**
 * Represents a basic document type definition.
 */
export interface DocumentType {
  /** Unique identifier of the document type */
  documentTypeId: string;
  /** Display name of the document type */
  documentTypeName: string;
}

/**
 * Represents a mapping between a source document type and a target document type.
 */
export interface SchemaDocumentType {
  /** Source document type identifier */
  documentTypeId: string;
  /** Source document type name */
  documentTypeName: string;
  /** Target document type identifier or name to map to */
  targetDocumentType: string; // ✅ Corregido el typo
}
