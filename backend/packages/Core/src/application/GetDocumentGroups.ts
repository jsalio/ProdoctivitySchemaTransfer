import { Credentials } from "../domain/Credentials";
import { DocumentGroup } from "../domain/DocumentGroup";
import { IRequest } from "../ports/IRequest";
import { IStore } from "../ports/IStore";
import { LoginValidator } from "../domain/Validations/LoginValidator";

export class GetDocumentGroups {

    /**
     *
     */
    constructor(private readonly request: IRequest<Credentials>, private readonly store: IStore) {

    }

    validate() {
        let validations = new LoginValidator(this.request.build())
        let errors = validations.Validate();
        return errors;
    }

    async execute(): Promise<{message:string, groups:DocumentGroup[]}> {
        try {
            const credentials = this.request.build()
            let groups = await this.store.getDocumentGroups(credentials)
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