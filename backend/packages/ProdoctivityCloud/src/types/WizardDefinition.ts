import { Page } from "./Page";

/**
 * Defines the structure and behavior of a wizard interface for document creation/editing.
 * This interface configures the multi-step form that users interact with when working with documents.
 */
export interface WizardDefinition {
  /** The default name to use for new pages in the wizard */
  defaultPageName: string;
  
  /** The default name to use for new sections within wizard pages */
  defaultSectionName: string;
  
  /** Array of explicit dependencies required by the wizard */
  dependencies: any[]; // TODO: Replace 'any' with a more specific type
  
  /** Array of dependencies that are automatically inferred by the system */
  inferredDependencies: any[]; // TODO: Replace 'any' with a more specific type
  
  /** Collection of pages that make up the wizard interface */
  pages: Page[];
}
