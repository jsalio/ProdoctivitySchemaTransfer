/**
 * Represents a data element in a document schema, defining the structure
 * and constraints of a single piece of data within a document.
 */
export interface DataElement {
  /** Unique identifier for the data element */
  id: string;

  /** Display name of the data element */
  name: string;

  /** Data type of the element (e.g., 'string', 'number', 'date') */
  dataType: string;

  /** Indicates whether the element is required ('true'/'false' as string) */
  required: string;
}
