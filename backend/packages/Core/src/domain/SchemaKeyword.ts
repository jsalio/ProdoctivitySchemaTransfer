
export interface SchemaKeyword {
    /** Internal name of the keyword (used in code) */
    name: string;

    /** Display label for the keyword (shown in UI) */
    label: string;

    /** Data type of the keyword value (e.g., 'string', 'number', 'date') */
    dataType: string;

    /** Whether this keyword is required for documents of this type */
    require: boolean;
}
