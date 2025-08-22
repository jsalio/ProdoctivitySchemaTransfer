import { Credentials } from "../domain/Credentials";
import { IRequest } from "../ports/IRequest";
import { IStore } from "../ports/IStore";
import { LoginValidator } from "../domain/Validations/LoginValidator";
import { SchemaDocumentType } from "../domain/SchemaDocumentType";

/**
 * Handles the retrieval of a document type schema based on the provided credentials and document type ID.
 * This class is responsible for validating the request and fetching the schema from the store.
 */
export class GetDocumentTypeSchema {
    /**
     * Creates a new instance of GetDocumentTypeSchema
     * @param request - The request object containing credentials and document type ID
     * @param store - The store interface for data access operations
     */
    constructor(
        private readonly request: IRequest<{credentials: Credentials, documentTypeId: string}>, 
        private readonly store: IStore
    ) {

    }

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
     * Executes the document type schema retrieval operation
     * @returns A promise that resolves to an object containing the schema or an error message
     */
    async execute(): Promise<{message: string, groups: SchemaDocumentType}> {
        try {
            const request = this.request.build();
            const schema = await this.store.getDocumentTypeSchema(request.credentials, request.documentTypeId);
            
            return {
                message: '',
                groups: schema
            };
        } catch (ex) {
            return {
                message: 'Error occurred while retrieving document type schema',
                groups: {} as any
            };
        }
    }
}