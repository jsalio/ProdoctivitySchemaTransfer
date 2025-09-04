/**
 * Configuration for document naming conventions and patterns.
 * Defines how document names should be generated or formatted.
 */
export interface NameConfig {
  /** The type of name configuration (e.g., 'prefix', 'suffix', 'pattern') */
  type: string;

  /** Optional name identifier for this configuration */
  name?: string;

  /** Data type of the value (e.g., 'string', 'date', 'number') */
  dataType?: string;

  /** The actual value or pattern to use */
  value?: string;
}
