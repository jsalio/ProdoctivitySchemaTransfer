import { Properties2 } from './Properties2';
import { Section } from './Section';

/**
 * Represents a single page within a wizard interface.
 * Pages organize related sections and fields in the document creation/editing workflow.
 */
export interface Page {
  /** Unique identifier for the page */
  key: string;

  /** Detailed description of the page's purpose */
  description: string;

  /** Display name of the page shown to users */
  label: string;

  /** Configuration properties for the page */
  properties: Properties2;

  /** Array of sections contained within this page */
  sections: Section[];
}
