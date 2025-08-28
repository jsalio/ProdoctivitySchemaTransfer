import { Credentials, DocumentType } from "@schematransfer/core";

import { CloudDocumentType } from "../types/CloudDocumentType";

export const GetDocumentTypeInGroup = async (credential: Credentials, documentGroupId: string): Promise<Set<DocumentType>> => {
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
            //body: JSON.stringify(request),
            redirect: "follow"
        };

        const response = await fetch(`${credential.serverInformation.server}/api/document-types/all`, requestOptions);
        if (!response.ok) {
            throw new Error(`Login failed with status ${response.status}: ${response.statusText}`);
        }

        const body: { documentTypes: CloudDocumentType[] } = await response.json();

        if (response.status === 200) {
            return new Set(filterDocumentTypeByGroupId(body.documentTypes).map((document) => ({
                documentTypeId: document.documentTypeId,
                documentTypeName: document.name
            })));
        }
        return new Set<DocumentType>();
    } catch (error) {
        console.error("Error during login:", error);
        throw error; // Re-throw para que el llamador maneje el error
    }
}