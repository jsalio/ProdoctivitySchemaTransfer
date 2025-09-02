import { AppCodeError } from "../domain/AppCodeError";
import { CreateDocumentGroupRequest } from "../domain/create-group-request";
import { DocumentGroup } from "../domain/DocumentGroup";
import { LoginValidator } from "../domain/Validations/LoginValidator";
import { IRequest } from "../ports/IRequest";
import { IStore } from "../ports/IStore";
import { CoreResult } from "../ports/Result";

export class CreateDocumentGroup {
    constructor(
        private readonly request: IRequest<CreateDocumentGroupRequest>,
        private readonly store: IStore
    ) {
    }

    validate() {
        const validations = new LoginValidator(this.request.build().credentials);
        const errors = validations.Validate();
        return errors;
    }

    async execute():Promise<CoreResult<DocumentGroup, AppCodeError, Error>> {
        if (!this.store.createDocumentGroup){
            return {
                ok:false,
                code:AppCodeError.StoreError,
                error: new Error("Store does not implement createDocumentGroup method")
            }
        }
        const request = this.request.build();
        const result = await this.store.createDocumentGroup(request.credentials, request.name);
        
        if (!result.ok){
            return {
                ok:false,
                code:AppCodeError.StoreError,
                error:result.error
            }
        }
        return result
    }
}