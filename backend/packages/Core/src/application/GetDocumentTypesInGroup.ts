import { Credentials } from "../domain/Credentials";
import { DocumentType } from "../domain/DocumentType";
import { IRequest } from "../ports/IRequest";
import { IStore } from "../ports/IStore";
import { LoginValidator } from "../domain/Validations/LoginValidator";

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
        private readonly request: IRequest<{credentials: Credentials, groupId: string}>, 
        private readonly store: IStore
    ) {}

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
    async execute(): Promise<{message: string, groups: DocumentType[]}> {
        try {
            const request = this.request.build();
            const groups = await this.store.getDocumentTypeInGroup(request.credentials, request.groupId);
            
            return {
                message: '',
                groups: Array.from(groups)
            };
        } catch (ex) {
            return {
                message: 'Error occurred while retrieving document types for the group',
                groups: []
            };
        }
    }
}