import { Credentials } from "../domain/Credentials";
import { LoginUseCaseResult } from "../domain/LoginUseCaseResult";
import { AppCodeError } from "../domain/AppCodeError";
import { LoginValidator } from "../domain/Validations/LoginValidator";
import { IRequest } from "../ports/IRequest";
import { IStore } from "../ports/IStore";
import { CoreResult } from "../ports/Result";

/**
 * Handles user authentication and login operations.
 * This class is responsible for validating credentials and managing user sessions.
 */
export class Login {
    /**
     * Creates a new instance of Login
     * @param request - The request object containing user credentials
     * @param store - The store interface for authentication operations
     */
    constructor(
        private readonly request: IRequest<Credentials>,
        private readonly store: IStore
    ) { }

    /**
     * Validates the login request by checking the provided credentials
     * @returns An array of validation errors, if any
     */
    validate() {
        const validations = new LoginValidator(this.request.build());
        const errors = validations.Validate();
        return errors;
    }

    /**
     * Executes the login operation
     * @returns A promise that resolves to an object containing the store information and authentication token
     */
    async execute(): Promise<CoreResult<LoginUseCaseResult, AppCodeError, Error>> {
        const request = this.request.build();

        const result = await this.store.login(request);

        // Determine the store type based on the database information
        const storeType = (!request.serverInformation.dataBase || request.serverInformation.dataBase === "")
            ? "Prodoctivity Cloud"
            : "Prodoctivity V5";

        console.info("Response",JSON.stringify(result))
        if (!result.ok) {
            return {
                code: AppCodeError.StoreError,
                ok: false,
                error: result.error
            }
        }

        return {
            ok: true,
            value: {
                store: storeType,
                token: result.value
            }
        };
    }

}