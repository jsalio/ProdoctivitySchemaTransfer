import { Credentials, DocumentType, Result } from "@schematransfer/core";

import { CloudDocumentType } from "../types/CloudDocumentType";

export const GetDocumentTypeInGroup = async (credential: Credentials, documentGroupId: string): Promise<Result<Array<DocumentType>, Error>> => {
    try {
        const filterDocumentTypeByGroupId = (documentTypes: CloudDocumentType[]) => {
            return documentTypes.filter((document) => document.documentGroupId === documentGroupId);
        }

        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", `Bearer ${credential.token}`)
        headers.append("x-api-key", credential.serverInformation.apiKey)
        headers.append("api-secret",credential.serverInformation.apiSecret)

        const requestOptions: RequestInit = {
            method: "GET",
            headers: headers,
            redirect: "follow"
        };

        const response = await fetch(`${credential.serverInformation.server}/api/document-types/all`, requestOptions);
        if (!response.ok) {
            return{
                ok:false,
                error:new Error(`Login failed with status ${response.status}: ${response.statusText}`)
            }
        }

        const body: { documentTypes: CloudDocumentType[] } = await response.json();

        if (response.status === 200) {
            return {
                ok:true,
                value:Array.from(new Set(filterDocumentTypeByGroupId(body.documentTypes).map((document) => ({
                    documentTypeId: document.documentTypeId,
                    documentTypeName: document.name
                }))))
            }
        }
        return{
            ok:false,
            error:new Error("No document types found in Group")
        }
    } catch (error) {
        return{
            ok:false,
            error:error as Error
        }
    }
}