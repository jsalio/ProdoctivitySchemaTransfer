import { AppCodeError } from "../domain/AppCodeError";
import { AssignDataElementToDocumentRequest } from "../domain/asign-data-element-to-document-request";
import { LoginValidator } from "../domain/Validations/LoginValidator";
import { IRequest } from "../ports/IRequest";
import { IStore } from "../ports/IStore";
import { CoreResult } from "../ports/Result";

/**
 * Handles the assignment of data elements to document types in the system.
 * This class is responsible for validating the request and executing the assignment
 * of a data element to a specific document type.
 */
export class AssignDataElement {
    /**
     * Creates an instance of AssignDataElement.
     * @param {IRequest<AssignDataElementToDocumentRequest>} request - The request containing the data element assignment details
     * @param {IStore} store - The store interface for data persistence operations
     */
    constructor(
        private readonly request: IRequest<AssignDataElementToDocumentRequest>,
        private readonly store: IStore
    ) {
    }

    /**
     * Validates the credentials provided in the request.
     * @returns {ValidationError[]} An array of validation errors, if any
     */
    validate() {
        const validations = new LoginValidator(this.request.build().credentials);
        const errors = validations.Validate();
        return errors;
    }

    /**
     * Executes the assignment of a data element to a document type.
     * @returns {Promise<CoreResult<boolean, AppCodeError, Error>>} A promise that resolves to the result of the operation
     * @throws {Error} If the store does not implement the required method
     */
    async execute(): Promise<CoreResult<boolean, AppCodeError, Error>> {
        if (!this.store.assignDataElementToDocumentType) {
            return {
                ok: false,
                code: AppCodeError.StoreError,
                error: new Error("Store does not implement assignDataElementToDocumentType method")
            }
        }
        const request = this.request.build();
        const result = await this.store.assignDataElementToDocumentType(request.credentials, {
            documentTypeId: request.assignDataElementToDocumentRequest.documentTypeId,
            dataElement: {
                name: request.assignDataElementToDocumentRequest.dataElement.name,
                order: request.assignDataElementToDocumentRequest.dataElement.order
            }
        });

        if (!result.ok) {
            return {
                ok: false,
                code: AppCodeError.StoreError,
                error: result.error
            }
        }
        return result;
    }
}