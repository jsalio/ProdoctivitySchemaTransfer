import { Credentials } from "../domain/Credentials";
import { LoginValidator } from "../domain/Validations/LoginValidator";
import { IRequest } from "../ports/IRequest";
import { IStore } from "../ports/IStore";

export class CreateDocumentGroup {
    constructor(
        private readonly request: IRequest<{ credentials: Credentials, name: string }>,
        private readonly store: IStore
    ) {
    }

    validate() {
        const validations = new LoginValidator(this.request.build().credentials);
        const errors = validations.Validate();
        return errors;
    }

    async execute() {
        if (!this.store.createDocumentGroup) {
            throw new Error("Store does not implement createDocumentGroup method");
        }
        try {
            const request = this.request.build();
            const schema = await this.store.createDocumentGroup(request.credentials, request.name);
            if(!schema.ok){
                return {
                    message: schema.error.message,
                    groups: null
                };  
            }
            return {
                message: '',
                groups: schema.value
            };
        } catch (ex) {
            return {
                message: 'Error occurred while retrieving document type schema',
                groups: null
            };
        }
    }
}