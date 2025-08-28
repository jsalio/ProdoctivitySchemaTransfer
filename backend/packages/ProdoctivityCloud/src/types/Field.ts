import { Properties } from "./Properties";

/**
 * Represents a field in a document type schema, containing metadata and properties
 * that define the field's behavior and appearance in the UI
 */
export interface Field {
  /** The machine-readable identifier for the field */
  name: string;
  
  /** The human-readable display name for the field */
  humanName: string;
  
  /** The complete path to this field in the document hierarchy */
  fullPath: string;
  
  /** Configuration properties that define the field's behavior and appearance */
  properties: Properties;
}
