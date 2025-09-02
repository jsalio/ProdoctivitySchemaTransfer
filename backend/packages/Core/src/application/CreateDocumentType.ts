import { AppCodeError } from "../domain/AppCodeError";
import { CreateDocumentTypeRequest } from "../domain/Create-document-type-request";
import { DocumentType } from "../domain/DocumentType";
import { LoginValidator } from "../domain/Validations/LoginValidator";
import { IRequest } from "../ports/IRequest";
import { IStore } from "../ports/IStore";
import { CoreResult } from "../ports/Result";

export class CreateDocumentType {
    constructor(
        private readonly request: IRequest<CreateDocumentTypeRequest>,
        private readonly store: IStore
    ) {
    }

    validate() {
        const validations = new LoginValidator(this.request.build().credentials);
        const errors = validations.Validate();
        return errors;
    }

    async execute(): Promise<CoreResult<DocumentType, AppCodeError, Error>> {
        if (!this.store.createDocumentType) {
            return {
                ok: false,
                code: AppCodeError.StoreError,
                error: new Error("Store does not implement createDocumentType method")
            }
        }
        const request = this.request.build();
        const result = await this.store.createDocumentType(request.credentials, {
            name: request.createDocumentTypeRequest.name,
            businessFunctionId: request.createDocumentTypeRequest.documentGroupId
        });
        if (!result.ok) {
            //console.log("Error :",result.error.message)
            return {
                ok: false,
                code: AppCodeError.StoreError,
                error: result.error
            }
        }
        return result;
    }
}