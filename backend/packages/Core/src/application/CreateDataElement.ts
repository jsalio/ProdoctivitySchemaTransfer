import { AppCodeError } from "../domain/AppCodeError";
import { CreateDataElementRequest } from "../domain/Create-data-element-request";
import { DataElement } from "../domain/DataElement";
import { LoginValidator } from "../domain/Validations/LoginValidator";
import { IRequest } from "../ports/IRequest";
import { IStore } from "../ports/IStore";
import { CoreResult } from "../ports/Result";

/**
 * Use case for creating a new data element in the system.
 * Handles validation and execution of the data element creation process.
 */
export class CreateDataElement {
    /**
     * Creates an instance of CreateDataElement.
     * @param request - The request containing data element creation details and credentials.
     * @param store - The storage interface for persisting data elements.
     */
    constructor(
        private readonly request: IRequest<CreateDataElementRequest>,
        private readonly store: IStore
    ) {
    }

    /**
     * Validates the request credentials.
     * @returns An array of validation errors, or an empty array if validation passes.
     */
    validate() {
        const validations = new LoginValidator(this.request.build().credentials);
        const errors = validations.Validate();
        return errors;
    }

    /**
     * Executes the data element creation process.
     * @returns A promise that resolves to a CoreResult containing the created DataElement on success,
     *          or an error if the operation fails.
     */
    async execute(): Promise<CoreResult<DataElement, AppCodeError, Error>> {
        if (!this.store.createDataElement) {
            return {
                ok: false,
                code: AppCodeError.StoreError,
                error: new Error("Store does not implement createDataElement method")
            }
        }

        const request = this.request.build();
        const result = await this.store.createDataElement(request.credentials, {
            name: request.createDataElementRequest.name,
            documentTypeId: "",
            dataType: request.createDataElementRequest.dataType,
            required: request.createDataElementRequest.isRequired
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