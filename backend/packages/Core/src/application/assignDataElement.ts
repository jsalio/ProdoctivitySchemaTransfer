import { Credentials } from "../domain/Credentials";
import { LoginValidator } from "../domain/Validations/LoginValidator";
import { IRequest } from "../ports/IRequest";
import { IStore } from "../ports/IStore";

export class AssignDataElement {
    constructor(
        private readonly request: IRequest<{ credentials: Credentials, 
            assignDataElementToDocumentTypeRequest: { documentTypeId: string,dataElement:{name: string, order: number}} }>,
        private readonly store: IStore
    ) {
    }

    validate() {
        const validations = new LoginValidator(this.request.build().credentials);
        const errors = validations.Validate();
        return errors;
    }

    async execute() {
        if (!this.store.assignDataElementToDocumentType) {
            throw new Error("Store does not implement assignDataElementToDocumentType method");
        }
        try {
            const request = this.request.build();
            const result = await this.store.assignDataElementToDocumentType(request.credentials, {
                documentTypeId: request.assignDataElementToDocumentTypeRequest.documentTypeId,
                dataElement: request.assignDataElementToDocumentTypeRequest.dataElement
            });
            if(!result.ok){
                return {
                    message: result.error.message,
                    assignment: null
                };  
            }
            return {
                message: '',
                assignment: result.value
            };
        } catch (ex) {
            return {
                message: 'Error occurred while assigning data element',
                assignment: ex
            };
        }
    }
}