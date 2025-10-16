/**
 * Describes a column configuration for a generic data table.
 * T is the record (row) type the table displays.
 */
export interface RecordRow<T> {
  /** The field in T that this column binds to */
  field: keyof T;
  /** Column header label */
  label: string;
  /** Optional field used for sorting; null disables sorting for this column */
  sortingBy?: keyof T | null;
  /** If true, sort ascending; false for descending */
  asc?: boolean;
}
