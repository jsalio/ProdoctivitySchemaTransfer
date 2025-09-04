import { DocumentType } from './DocumentType';

/**
 * Represents the complete schema definition for a cloud document type,
 * containing all the necessary metadata and configuration for a document type.
 * This serves as a wrapper around the DocumentType interface.
 */
export interface CloudDocumentTypeSchema {
  /** The document type definition containing all schema details */
  documentType: DocumentType;
}
