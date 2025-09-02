
export interface ServiceResponse<T = unknown|undefined, E=Error|undefined|string> {
    success: boolean;
    data: T| undefined;
    error:E;
}
