import { ElysiaContext } from "../types/ElysiaContext";
import { ServiceResponse } from "../types/ServiceResponse";
import { HTTP_STATUS } from "./HTTP_STATUS";



export const handleServiceResponse = <T>(
    result: T,
    set: ElysiaContext['set']
): ServiceResponse<T> => {
    const isError = typeof result === 'string';
    set.status = isError ? HTTP_STATUS.FORBIDDEN : HTTP_STATUS.OK;

    return {
        success: !isError,
        data: result
    };
};
