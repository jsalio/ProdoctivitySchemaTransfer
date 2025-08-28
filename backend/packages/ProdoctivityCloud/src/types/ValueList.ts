
/**
 * Represents a key-value pair typically used for dropdown/select options
 * where a display label is associated with a corresponding value
 */
export interface ValueList {
  /** The display text shown to users */
  label: string;
  
  /** The underlying value associated with the label */
  value: string;
}
