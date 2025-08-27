import { CreateDataElementRequest } from "../domain/Create-data-element-request";
import { LoginValidator } from "../domain/Validations/LoginValidator";
import { IRequest } from "../ports/IRequest";
import { IStore } from "../ports/IStore";

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

    async execute() {
        console.log('request on Core:', JSON.stringify(this.request.build(), null, 2))
        if (!this.store.createDataElement) {
            throw new Error("Store does not implement createDataElement method");
        }
        try {
            const request = this.request.build();
            const result = await this.store.createDataElement(request.credentials, {
                name: request.createDataElementRequest.name,
                documentTypeId: "",
                dataType: request.createDataElementRequest.dataType,
                require: request.createDataElementRequest.isRequired
            });
            if (!result.ok) {
                console.log('Elements not created on Core:', result.error)
                return {
                    message: result.error.message,
                    dataElement: null
                };
            }
            return {
                message: '',
                dataElement: result.value
            };
        } catch (ex) {
            console.log('error on Core:', ex)   
            return {
                message: 'Error occurred while creating data element',
                dataElement: ex
            };
        }
    }
}