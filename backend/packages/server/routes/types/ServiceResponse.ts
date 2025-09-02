
export interface ServiceResponse<T = unknown|undefined, E=Error|undefined> {
    success: boolean;
    data: T| undefined;
    error:E;
}
