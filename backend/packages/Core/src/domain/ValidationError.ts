export type ValidationError<T> = {
    field: keyof T;
    message: string;
};
