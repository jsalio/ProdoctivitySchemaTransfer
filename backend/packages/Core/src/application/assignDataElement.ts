import { AssignDataElementToDocumentRequest } from "../domain/asign-data-element-to-document-request";
import { LoginValidator } from "../domain/Validations/LoginValidator";
import { IRequest } from "../ports/IRequest";
import { IStore } from "../ports/IStore";

export class AssignDataElement {
    constructor(
        private readonly request: IRequest<AssignDataElementToDocumentRequest>,
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
        console.log('Store to assign:', JSON.stringify(this.request.build(), null, 2))
        try {
            const request = this.request.build();
            const result = await this.store.assignDataElementToDocumentType(request.credentials, {
                documentTypeId: request.assignDataElementToDocumentRequest.documentTypeId,
                dataElement: {
                    name: request.assignDataElementToDocumentRequest.dataElement.name,
                    order: request.assignDataElementToDocumentRequest.dataElement.order
                }
            });
            if(!result.ok){
                console.log('Assignment not created on Core:', result.error)
                return {
                    message: result.error.message,
                    assignment: null
                };  
            }
            console.log('Assignment result:', JSON.stringify(result, null, 2))
            return {
                message: '',
                assignment: result.value
            };
        } catch (ex) {
            console.log('Error assigning data element:', ex)
            return {
                message: 'Error occurred while assigning data element',
                assignment: ex
            };
        }
    }
}