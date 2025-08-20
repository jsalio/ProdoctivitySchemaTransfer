import { DocumentType, SchemaDocumentType } from "../domain/DocumentGroup";

import { Credentials } from "../domain/Credentials";
import { IRequest } from "../ports/IRequest";
import { IStore } from "../ports/IStore";
import { LoginValidator } from "../domain/Validations/LoginValidator";

export class GetDocumentTypeSchema {

    /**
     *
     */
    constructor(private readonly request: IRequest<{credentials:Credentials,documentTypeId:string}>, private readonly store: IStore) {

    }

    validate() {
        let validations = new LoginValidator(this.request.build().credentials)
        let errors = validations.Validate();
        return errors;
    }

    async execute(): Promise<{message:string, groups:SchemaDocumentType}> {
        try {
            const request = this.request.build()
            let schema = await this.store.getDocumentTypeSchema(request.credentials, request.documentTypeId)
            // console.log('Data here', schema)
            return {
                message:'',
                groups: schema
            };
        }
        catch (ex) {
            return {
                message: "Error occurs",
                groups:{} as any
            }
        }
    }
}