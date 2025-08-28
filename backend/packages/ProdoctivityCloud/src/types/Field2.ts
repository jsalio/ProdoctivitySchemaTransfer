
/**
 * Represents a simplified field definition used within sections of the wizard interface.
 * This is a variant of the Field interface with a reduced set of properties.
 */
export interface Field2 {
  /** Indicates whether this field represents a record */
  isRecord: boolean;
  
  /** Unique identifier for the field */
  key: string;
  
  /** Display label for the field */
  label: string;
}
