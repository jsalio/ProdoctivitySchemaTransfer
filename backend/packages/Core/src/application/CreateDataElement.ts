import { AppCodeError } from "../domain/AppCodeError";
import { CreateDataElementRequest } from "../domain/Create-data-element-request";
import { DataElement } from "../domain/DataElement";
import { LoginValidator } from "../domain/Validations/LoginValidator";
import { IRequest } from "../ports/IRequest";
import { IStore } from "../ports/IStore";
import { CoreResult } from "../ports/Result";

export class CreateDataElement {
    constructor(
        private readonly request: IRequest<CreateDataElementRequest>,
        private readonly store: IStore
    ) {
    }

    validate() {
        const validations = new LoginValidator(this.request.build().credentials);
        const errors = validations.Validate();
        return errors;
    }

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

        if (!result.ok){
            return{
                ok:false,
                code:AppCodeError.StoreError,
                error:result.error
            }
        }
         return result
    }
}