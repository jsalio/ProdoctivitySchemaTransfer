
import {Credentials, IStore, Login} from "@schematransfer/core"
import { BaseService } from "./BaseService"

export class AuthService extends BaseService{
    /**
     *
     */
    constructor( private readonly store: IStore,) {
        super()
    }

    async LoginToStore(loginData: Credentials):Promise<{store:string, token:string}| string> {
        try{
            const  request = this.buildRequest<Credentials>(loginData)
            let login = new Login(request, this.store)
            const error = this.checkValidation(login.validate())
            if (error !== ""){
                return error
            }
            const result = await login.execute()
            if (result.token ===""){
                return "Error occurs"
            }
            return result
        }
        catch(err){
            return "Error occurs"
        }
    }
}

