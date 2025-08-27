import { Credentials } from "./Credentials"

export type AssignDataElementToDocumentRequest = {
   credentials: Credentials,
   assignDataElementToDocumentRequest: { documentTypeId: string, dataElement: { name: string, order: number } }
}