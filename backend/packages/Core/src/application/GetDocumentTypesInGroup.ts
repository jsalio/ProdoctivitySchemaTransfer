import { Credentials } from "../domain/Credentials";
import { DocumentType } from "../domain/DocumentType";
import { IRequest } from "../ports/IRequest";
import { IStore } from "../ports/IStore";
import { LoginValidator } from "../domain/Validations/LoginValidator";

export class GetDocumentTypesGroups {

    /**
     *
     */
    constructor(private readonly request: IRequest<{credentials:Credentials,groupId:string}>, private readonly store: IStore) {

    }

    validate() {
        let validations = new LoginValidator(this.request.build().credentials)
        let errors = validations.Validate();
        return errors;
    }

    async execute(): Promise<{message:string, groups:DocumentType[]}> {
        try {
            const request = this.request.build()
            let groups = await this.store.getDocumentTypeInGroup(request.credentials, request.groupId)
            return {
                message:'',
                groups: Array.from(groups)
            };
        }
        catch (ex) {
            return {
                message: "Error occurs",
                groups:[]
            }
        }
    }
}