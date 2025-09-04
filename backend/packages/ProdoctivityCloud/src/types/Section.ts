import { Field2 } from './Field2';
import { Properties3 } from './Properties3';

/**
 * Represents a logical grouping of fields within a page in the wizard interface.
 * Sections help organize related fields together for better user experience.
 */
export interface Section {
  /** Unique identifier for the section */
  key: string;

  /** Detailed description of the section's purpose */
  description: string;

  /** Display name of the section shown to users */
  label: string;

  /** Configuration properties specific to this section */
  properties: Properties3;

  /** Array of fields contained within this section */
  fields: Field2[];
}
