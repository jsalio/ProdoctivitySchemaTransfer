/**
 * Represents a validation error for a specific field in a type.
 * 
 * @template T - The type of the object being validated
 */
export type ValidationError<T> = {
    /** The field in the object that failed validation */
    field: keyof T;
    
    /** Human-readable error message describing the validation failure */
    message: string;
};
