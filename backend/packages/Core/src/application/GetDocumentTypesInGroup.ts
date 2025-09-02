import { Credentials } from "../domain/Credentials";
import { DocumentType } from "../domain/DocumentType";
import { IRequest } from "../ports/IRequest";
import { IStore } from "../ports/IStore";
import { LoginValidator } from "../domain/Validations/LoginValidator";
import { CoreResult } from "../ports/Result";
import { AppCodeError } from "../domain/AppCodeError";
import { GetDocumentGroupRequest } from "../domain/GetDocumentGroupRequest";

/**
 * Handles the retrieval of document types within a specific group.
 * This class is responsible for validating the request and fetching document types from the specified group.
 */
export class GetDocumentTypesGroups {
    /**
     * Creates a new instance of GetDocumentTypesGroups
     * @param request - The request object containing credentials and group ID
     * @param store - The store interface for data access operations
     */
    constructor(
        private readonly request: IRequest<GetDocumentGroupRequest>,
        private readonly store: IStore
    ) { }

    /**
     * Validates the request by checking the provided credentials
     * @returns An array of validation errors, if any
     */
    validate() {
        const validations = new LoginValidator(this.request.build().credentials);
        const errors = validations.Validate();
        return errors;
    }

    /**
     * Executes the document types retrieval operation for the specified group
     * @returns A promise that resolves to an object containing the document types or an error message
     */
    async execute(): Promise<CoreResult<DocumentType[], AppCodeError, Error>> {
        const request = this.request.build();
        const result = await this.store.getDocumentTypeInGroup(request.credentials, request.groupId);

        if (!result.ok) {
            return {
                ok: false,
                code: AppCodeError.StoreError,
                error: result.error
            }
        }

        return {
            ok: true,
            value: Array.from(result.value)
        }
    }
}