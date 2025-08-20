import { Credentials, GetDocumentGroups, GetDocumentTypeSchema, GetDocumentTypesGroups, IStore } from "@schematransfer/core";

import { BaseService } from "./BaseService";

//import { GetDocumentTypeInGroup } from "packages/ProdoctivityCloud/src/functions/ListDocumentTypeGroups";

export class SchemaService extends BaseService {
    /**
     *
     */
    constructor(private readonly store: IStore) {
        super();
    }

    async GetListOfDocumentGroups(credentials: Credentials) {
        try {
            console.log(this.store.getStoreName())
            const request = this.buildRequest<Credentials>(credentials)
            let login = new GetDocumentGroups(request, this.store)
            const error = this.checkValidation(login.validate())
            if (error !== "") {
                return error
            }
            const result = await login.execute()
            if (result.message !== "") {
                return result.message
            }
            
            return result.groups
        }
        catch (err) {
            return "Error occurs"
        }
    }

    async GetListDocumentTypesGroup(credential:Credentials, groupId:string)
    {
        try {
            const request = this.buildRequest<{credentials: Credentials, groupId: string}>({credentials:credential, groupId:groupId})
            let login = new GetDocumentTypesGroups(request, this.store)
            const error = this.checkValidation(login.validate())
            if (error !== "") {
                return error
            }
            const result = await login.execute()
            if (result.message !== "") {
                return result.message
            }
            
            return result.groups
        }
        catch (err) {
            return "Error occurs"
        }

    }

    async GetDocumentTypeSchema(credential:Credentials, documentTypeId:string)
    {
        try {
            const request = this.buildRequest<{credentials: Credentials, documentTypeId: string}>({credentials:credential, documentTypeId: documentTypeId})
            let login = new GetDocumentTypeSchema(request, this.store)
            const error = this.checkValidation(login.validate())
            if (error !== "") {
                return error
            }
            const result = await login.execute()
            if (result.message !== "") {
                return result.message
            }
            // console.log('server data:',result.groups)
            
            return result.groups
        }
        catch (err) {
            return "Error occurs"
        }

    }
    
}