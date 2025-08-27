import { CreateDocumentTypeRequest } from "../domain/Create-document-type-request";
import { LoginValidator } from "../domain/Validations/LoginValidator";
import { IRequest } from "../ports/IRequest";
import { IStore } from "../ports/IStore";

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

    async execute() {
        if (!this.store.createDocumentType) {
            throw new Error("Store does not implement createDocumentType method");
        }
        try {
            const request = this.request.build();
            // console.log("request for document type creation:", JSON.stringify(request, null, 2))
            // console.log("Store:", this.store.getStoreName())
            const result = await this.store.createDocumentType(request.credentials, {
                name: request.createDocumentTypeRequest.name,
                buseinessFunctionId: request.createDocumentTypeRequest.documentGroupId
            });
            // console.log("result:", JSON.stringify(result, null, 2))
            if(!result.ok){
                // console.log("error creating document type:", JSON.stringify(result.error, null, 2))
                return {
                    message: result.error.message,
                    documentType: null
                };  
            }
            // console.log("document type created:", JSON.stringify(result.value, null, 2))
            return {
                message: '',
                documentType: result.value
            };
        } catch (ex) {
            console.log("error creating document type:",ex)
            return {
                message: 'Error occurred while creating document type',
                documentType: null
            };
        }
    }
}