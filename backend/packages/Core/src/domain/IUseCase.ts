import { CoreResult } from "../ports/Result";
import { AppCodeError } from "./AppCodeError";
import { ValidationError } from "./ValidationError";



export interface IUseCase<T = any> {
    validate(): ValidationError<T>[];
    execute(): Promise<CoreResult<T, AppCodeError, Error>>;
}
;
