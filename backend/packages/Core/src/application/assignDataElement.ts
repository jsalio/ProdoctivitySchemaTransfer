import { AppCodeError } from "../domain/AppCodeError";
import { AssignDataElementToDocumentRequest } from "../domain/asign-data-element-to-document-request";
import { Credentials } from "../domain/Credentials";
import { ValidationError } from "../domain/ValidationError";
import { IUseCase } from "../domain/IUseCase";
import { LoginValidator } from "../domain/Validations/LoginValidator";
import { IRequest } from "../ports/IRequest";
import { IStore } from "../ports/IStore";
import { CoreResult } from "../ports/Result";

export class AssignDataElement {
    constructor(
        private readonly request: IRequest<AssignDataElementToDocumentRequest>,
        private readonly store: IStore
    ) {
    }

    validate():ValidationError<Credentials>[] {
        const validations = new LoginValidator(this.request.build().credentials);
        const errors = validations.Validate();
        return errors;
    }

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