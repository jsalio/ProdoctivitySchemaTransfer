import { Field } from "./Field";

/**
 * Defines the context structure for a document type, including both
 * the fields that make up the context and any associated records.
 */
export interface ContextDefinition {
  /** Array of context records, typically containing metadata or configuration */
  records: any[]; // TODO: Replace 'any' with a more specific type
  
  /** Array of fields that define the structure of the context */
  fields: Field[];
}
