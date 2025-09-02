import { Credentials } from "../domain/Credentials";
import { DataElement } from "../domain/DataElement";
import { IRequest } from "../ports/IRequest";
import { IStore } from "../ports/IStore";
import { LoginValidator } from "../domain/Validations/LoginValidator";
import { CoreResult } from "../ports/Result";
import { AppCodeError } from "../domain/AppCodeError";

/**
 * Handles the retrieval of all data elements from the system.
 * This class is responsible for validating the request and fetching data elements from the store.
 */
export class GetAllDataElemets {
    /**
     * Creates a new instance of GetAllDataElements
     * @param request - The request object containing user credentials
     * @param store - The store interface for data access operations
     */
    constructor(
        private readonly request: IRequest<Credentials>,
        private readonly store: IStore
    ) { }

    /**
     * Validates the request by checking the provided credentials
     * @returns An array of validation errors, if any
     */
    validate() {
        const validations = new LoginValidator(this.request.build());
        const errors = validations.Validate();
        return errors;
    }

    /**
     * Executes the data elements retrieval operation
     * @returns A promise that resolves to an object containing the data elements or an error message
     */
    async execute(): Promise<CoreResult<Array<DataElement>, AppCodeError, Error>> {
        const credentials = this.request.build();
        const result = await this.store.getDataElements(credentials);

        if (!result.ok){
            return {
                ok:false,
                code:AppCodeError.StoreError,
                error: result.error
            }
        }
        return result
    }
}