import { Credentials } from "../domain/Credentials";
import { DataElement } from "../domain/DataElement";
import { IRequest } from "../ports/IRequest";
import { IStore } from "../ports/IStore";
import { LoginValidator } from "../domain/Validations/LoginValidator";

export class GetAllDataElemets {

    constructor(private readonly request: IRequest<Credentials>, private readonly store: IStore) {

    }

    validate() {
        let validations = new LoginValidator(this.request.build())
        let errors = validations.Validate();
        return errors;
    }

    async execute(): Promise<{message:string, dataElements:DataElement[]}> {
        try {
            const credentials = this.request.build()
            let groups = await this.store.getDataElements(credentials)
            return {
                message:'',
                dataElements: Array.from(groups)
            };
        }
        catch (ex) {
            return {
                message: "Error occurs",
                dataElements:[]
            }
        }
    }
}