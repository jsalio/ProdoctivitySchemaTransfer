/**
 * Schema describing the keywords associated with a specific document type.
 */
export interface DocumentTypeKeywordSchema {
  /** Name of the document type */
  name: string;
  /** Unique identifier of the document type */
  documentTypeId: string;
  /** Keywords defined for the document type */
  keywords: DocumetTypeKeyword[];
}

/**
 * Metadata definition for a single keyword within a document type schema.
 */
export interface DocumetTypeKeyword {
  /** Internal name of the keyword */
  name: string;
  /** Display label for the keyword */
  label: string;
  /** Data type of the keyword (e.g., string, number, date) */
  dataType: string;
  /** Whether the keyword is required */
  require: boolean;
  /** Whether this keyword should be synchronized */
  isSync: boolean;
  /** Indicates if the keyword exists in the target system */
  presentInTarget: boolean;
  /** Identifier of the corresponding keyword in the target system */
  targetKeywordId: string;
  /** Sorting order for display or processing */
  order: number;
}
