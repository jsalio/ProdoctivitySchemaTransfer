import { Credentials } from "../domain/Credentials";
import { LoginValidator } from "../domain/Validations/LoginValidator";
import { IRequest } from "../ports/IRequest";
import { IStore } from "../ports/IStore";

export class Login {

    /**
     * 
     * @param request 
     * @param store 
     */
    constructor(private readonly request: IRequest<Credentials>, private readonly store: IStore) {

    }

    validate() {
        let validations = new LoginValidator(this.request.build())
        let errors = validations.Validate();
        return errors;
    }

    async execute(): Promise<{store:string, token:string}> {
        const request = this.request.build()
        try {
            var token = await this.store.login(request)
            console.log(token)
            
           return {
                store: (request.serverInformation.dataBase === "" || !request.serverInformation.dataBase ) ? "Prodoctivity Cloud" : "Prodoctivity V5",
                token: token
           }
        }
        catch (ex) {
            return {
                store:'',
                token:''
            }
        }
    }


}