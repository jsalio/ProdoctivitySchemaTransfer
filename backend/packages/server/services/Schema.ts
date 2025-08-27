import { AssignDataElement, AssignDataElementToDocumentRequest, CreateDataElement, CreateDocumentGroup, CreateDocumentGroupRequest, CreateDocumentType, Credentials, GetAllDataElemets, GetDocumentGroups, GetDocumentTypeSchema, GetDocumentTypesGroups, IStore } from "@schematransfer/core";

import { BaseService } from "./BaseService";
import { CreateDocumentTypeRequest } from "packages/Core/src/domain/Create-document-type-request";
import { CreateDataElementRequest } from "packages/Core/src/domain/Create-data-element-request";

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

    async GetListDocumentTypesGroup(credential: Credentials, groupId: string) {
        try {
            const request = this.buildRequest<{ credentials: Credentials, groupId: string }>({ credentials: credential, groupId: groupId })
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

    async GetDocumentTypeSchema(credential: Credentials, documentTypeId: string) {
        try {
            const request = this.buildRequest<{ credentials: Credentials, documentTypeId: string }>({ credentials: credential, documentTypeId: documentTypeId })
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

    async GetSystemDataElements(credential: Credentials) {
        try {
            console.log(this.store.getStoreName())
            const request = this.buildRequest<Credentials>(credential)
            let login = new GetAllDataElemets(request, this.store)
            const error = this.checkValidation(login.validate())
            if (error !== "") {
                return error
            }
            const result = await login.execute()
            if (result.message !== "") {
                return result.message
            }

            return result.dataElements
        }
        catch (err) {
            return "Error occurs"
        }
    }

    async CreateDocumentGroup(body:CreateDocumentGroupRequest) {
        try {
            const request = this.buildRequest<CreateDocumentGroupRequest>(body)
            let login = new CreateDocumentGroup(request, this.store)
            // console.log('request:', JSON.stringify(body, null, 2))
            // console.log('request credentials:', JSON.stringify(request.build().credentials, null, 2))
            // console.log('request name:', JSON.stringify(request.build().name, null, 2))
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

    async CreateDocumentType(body:CreateDocumentTypeRequest) {
        console.log('request:', JSON.stringify(body, null, 2))
        try {
            const request = this.buildRequest<CreateDocumentTypeRequest>(body)
            let login = new CreateDocumentType(request, this.store)
            const error = this.checkValidation(login.validate())
            if (error !== "") {
                return error
            }
            const result = await login.execute()
            if (result.message !== "") {
                return result.message
            }

            return result.documentType
        }
        catch (err) {
            return "Error occurs"
        }
    }

    // async CreateDataElement(body:{credential: Credentials, createDataElementRequest: { name: string, dataType: string, isRequired: boolean }}) {
    //     try {
    //         const request = this.buildRequest<
    //             {
    //                 credentials: Credentials,
    //                 createDataElementRequest: { name: string, dataType: string, isRequired: boolean }
    //             }>({ credentials: body.credential, createDataElementRequest: { name: body.createDataElementRequest.name, dataType: body.createDataElementRequest.dataType, isRequired: body.createDataElementRequest.isRequired } })
    //         let login = new CreateDataElement(request, this.store)
    //         const error = this.checkValidation(login.validate())
    //         if (error !== "") {
    //             return error
    //         }
    //         const result = await login.execute()
    //         if (result.message !== "") {
    //             return result.message
    //         }

    //         return result.documentType
    //     }
    //     catch (err) {
    //         return "Error occurs"
    //     }
    // }

    async CreateDataElement(body:CreateDataElementRequest) {
        try {
            const request = this.buildRequest<CreateDataElementRequest>(body)
            let login = new CreateDataElement(request, this.store)
            const error = this.checkValidation(login.validate())
            if (error !== "") {
                return error
            }
            const result = await login.execute()
            if (result.message !== "") {
                return result.message
            }

            return result.dataElement
        }
        catch (err) {
            return "Error occurs"
        }
    }

    async AssignDataElementToDocumentType(body:AssignDataElementToDocumentRequest) {
        try {
            // console.log('Store to login:', JSON.stringify(body, null, 2))
            const request = this.buildRequest<AssignDataElementToDocumentRequest>(body)
            let login = new AssignDataElement(request, this.store)
            const error = this.checkValidation(login.validate())
            if (error !== "") {
                return error
            }
            const result = await login.execute()
            if (result.message !== "") {
                return result.message
            }

            return result.assignment
        }
        catch (err) {
            return "Error occurs"
        }
    }
}