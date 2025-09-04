
import {AppCodeError, CoreResult, Credentials, IStore, Login, LoginUseCaseResult} from "@schematransfer/core"
import { BaseService } from "./BaseService"
// import { LoginUseCaseResult } from "packages/Core/src/domain/LoginUseCaseResult"
// import { AppCodeError } from "packages/Core/src/domain/AppCodeError"

export class AuthService extends BaseService{
    /**
     *
     */
    constructor( private readonly store: IStore,) {
        super()
    }

    async LoginToStore(loginData: Credentials):Promise<CoreResult<LoginUseCaseResult, AppCodeError, Error>>{
        try{
            const  request = this.buildRequest<Credentials>(loginData)
            let login = new Login(request, this.store)
            const error = this.checkValidation(login.validate())
            if (error !== ""){
                return {
                    ok:false,
                    code:AppCodeError.ValidationsFailed,
                    error: new Error(`Validations fails:${error}`)
                }
            }
            const result = await login.execute()
            return result
        }
        catch(err){
            return {
                ok:false,
                code:AppCodeError.UnmanagedError,
                error: new Error(`Unmanaged error`)
            }
        }
    }
}

