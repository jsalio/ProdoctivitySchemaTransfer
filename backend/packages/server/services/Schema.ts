import { AssignDataElement, CreateDataElement, CreateDocumentGroup, CreateDocumentType, Credentials, GetAllDataElemets, GetDocumentGroups, GetDocumentTypeSchema, GetDocumentTypesGroups, IStore } from "@schematransfer/core";

import { BaseService } from "./BaseService";

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

    async CreateDocumentGroup(body:{credential: Credentials, name: string}) {
        try {
            const request = this.buildRequest<{ credentials: Credentials, name: string }>({ credentials: body.credential, name: body.name })
            let login = new CreateDocumentGroup(request, this.store)
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

    async CreateDocumentType(body:{credential: Credentials, createDocumentTypeRequest: { name: string, documentGroupId: string }}) {
        try {
            const request = this.buildRequest<
                {
                    credentials: Credentials,
                    createDocumentTypeRequest: { name: string, documentGroupId: string }
                }>({ credentials: body.credential, createDocumentTypeRequest: { name: body.createDocumentTypeRequest.name, documentGroupId: body.createDocumentTypeRequest.documentGroupId } })
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

    async CreateDataElement(body:{credential: Credentials, createDataElementRequest: { name: string, dataType: string, isRequired: boolean }}) {
        try {
            const request = this.buildRequest<
                {
                    credentials: Credentials,
                    createDataElementRequest: { name: string, dataType: string, isRequired: boolean }
                }>(
                    {
                        credentials: body.credential,
                        createDataElementRequest: {
                            name: body.createDataElementRequest.name,
                            dataType: body.createDataElementRequest.dataType,
                            isRequired: body.createDataElementRequest.isRequired
                        }
                    })
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

    async AssignDataElementToDocumentType(body:{credential: Credentials, assignDataElementToDocumentTypeRequest: { documentTypeId: string, dataElement: { name: string, order: number } }}) {
        try {
            const request = this.buildRequest<
                {
                    credentials: Credentials,
                    assignDataElementToDocumentTypeRequest: { documentTypeId: string, dataElement: { name: string, order: number } }
                }>(
                    {
                        credentials: body.credential,
                        assignDataElementToDocumentTypeRequest: {
                            documentTypeId: body.assignDataElementToDocumentTypeRequest.documentTypeId,
                            dataElement: body.assignDataElementToDocumentTypeRequest.dataElement
                        }
                    })
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