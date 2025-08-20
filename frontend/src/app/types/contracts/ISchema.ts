import { Credentials } from "../models/Credentials";
import { Observable } from "rxjs";

export type DocumentGroup = {
    groupId: string,
    groupName: string,
    documentTypesCounter: number
}

export interface IScehma {
    getDocumentGruops:(credetials:Credentials) => Observable<{data: Array<DocumentGroup>, success:boolean}>
    getDocumentTypesInGroup:(credentials:Credentials, groupId:string) => Observable<{data: Array<any>, success:boolean}>
    getDocumentTypeSchema:(credentials:Credentials, documentTypeId:string) => Observable<{data: Array<any>, success:boolean}>
}