import { DataElement, DocumentGroup, DocumentType, SchemaDocumentType } from "../domain/DocumentGroup";

import { Credentials } from "../domain/Credentials";

export interface IStore 
{
    login(credentials: Credentials):Promise<string>
    getDocumentGroups(credential:Credentials) :Promise<Set<DocumentGroup>>
    getDocumentTypeInGroup(credential: Credentials, documentGroupId: string):Promise<Set<DocumentType>>
    getDocumentTypeSchema(credential: Credentials, documentTypeId: string):Promise<SchemaDocumentType>
    getDataElements:(credential:Credentials)=> Promise<Set<DataElement>>
    getStoreName:() => string
}
