import { Credentials } from "../domain/Credentials";
import { LoginValidator } from "../domain/Validations/LoginValidator";
import { IRequest } from "../ports/IRequest";
import { IStore } from "../ports/IStore";

export class CreateDocumentType {
    constructor(
        private readonly request: IRequest<{ credentials: Credentials, createDocumentTypeRequest: { name: string, documentGroupId: string } }>,
        private readonly store: IStore
    ) {
    }

    validate() {
        const validations = new LoginValidator(this.request.build().credentials);
        const errors = validations.Validate();
        return errors;
    }

    async execute() {
        if (!this.store.createDocumentType) {
            throw new Error("Store does not implement createDocumentType method");
        }
        try {
            const request = this.request.build();
            const result = await this.store.createDocumentType(request.credentials, {
                name: request.createDocumentTypeRequest.name,
                buseinessFunctionId: request.createDocumentTypeRequest.documentGroupId
            });
            if(!result.ok){
                return {
                    message: result.error.message,
                    documentType: null
                };  
            }
            return {
                message: '',
                documentType: result.value
            };
        } catch (ex) {
            return {
                message: 'Error occurred while creating document type',
                documentType: null
            };
        }
    }
}