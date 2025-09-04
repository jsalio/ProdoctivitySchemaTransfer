import { Credentials } from "../domain/Credentials";
import { DocumentGroup } from "../domain/DocumentGroup";
import { IRequest } from "../ports/IRequest";
import { IStore } from "../ports/IStore";
import { LoginValidator } from "../domain/Validations/LoginValidator";
import { CoreResult } from "../ports/Result";
import { AppCodeError } from "../domain/AppCodeError";

/**
 * Handles the retrieval of document groups from the system.
 * This class is responsible for validating the request and fetching document groups from the store.
 */
export class GetDocumentGroups {
    /**
     * Creates a new instance of GetDocumentGroups
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
     * Executes the document groups retrieval operation
     * @returns A promise that resolves to an object containing the document groups or an error message
     */
    async execute(): Promise<CoreResult<Array<DocumentGroup>, AppCodeError, Error>> {
        const credentials = this.request.build();
        const result = await this.store.getDocumentGroups(credentials);
        // console.log("Core :",JSON.stringify(result.))
        if (!result.ok){
            return {
                ok:false,
                code:AppCodeError.StoreError,
                error:result.error
            }
        }
        console.log("Core :",JSON.stringify(result.value.values))
        return {
            ok:true,
            value:result.value
        }
    }


}