import { ValueList } from './ValueList';

/**
 * Defines the properties and behavior of a field in the document schema.
 * This interface contains configuration options that control how a field is displayed,
 * validated, and processed within the system.
 */
export interface Properties {
  /** Detailed description of the field's purpose */
  description: string;

  /** Human-readable name for the field */
  humanName: string;

  /** Instructions or help text for the field */
  instructions: string;

  /** Display label for the field */
  label: string;

  /** Size of the form control (e.g., 'small', 'medium', 'large') */
  controlSize: string;

  /** Whether the field value must be unique across all documents */
  isUnique: boolean;

  /** Data type of the field (e.g., 'string', 'number', 'date') */
  dataType: string;

  /** Minimum number of occurrences required (for repeatable fields) */
  minOccurs: number;

  /** Maximum number of occurrences allowed (for repeatable fields) */
  maxOccurs: number;

  /** Example values for the field */
  sampleValue: string[];

  /** Type of input control to use (e.g., 'text', 'select', 'checkbox') */
  inputType: string;

  /** Whether to provide auto-complete suggestions for the field */
  autoCompleteValues?: boolean;

  /** Whether the value list includes display labels */
  listHasLabels?: boolean;

  /** List of predefined values for the field */
  valueList?: ValueList[];

  /** Identifier for a dictionary list, if applicable */
  dictionaryListId?: string;

  /** Path to the dictionary list in the system */
  dictionaryListPath?: any[]; // TODO: Replace 'any' with a more specific type

  /** Default value(s) for the field */
  defaultValue?: string[];
}
