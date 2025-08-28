
export interface ServiceResponse<T = unknown> {
    success: boolean;
    data: T;
}
