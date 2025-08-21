///api/business-functions
import { Credentials, DocumentGroup, DocumentType } from "@schematransfer/core";

export type FluencyDocumentType = {
    id: number,
    name: string,
    businessLine:{
        id:number,
        name:string
    }
}

/**
 * 
 * @param credential 
 * @returns 
 */
export const getDocumentTypes = async (credential: Credentials,id:string): Promise<any> => {
    try {
        const headers = new Headers();
        headers.append("x-api-key", credential.serverInformation.apiKey)
        const basicAuthText=`${credential.username+"@prodoctivity capture"}:${credential.password}`
        headers.append("Authorization", `Basic ${btoa(basicAuthText)}`);

        const requestOptions: RequestInit = {
            method: "GET",
            headers: headers,
            redirect: "follow"
        };

        const response = await fetch(`${credential.serverInformation.server}/site/api/v2/document-types`, requestOptions);

        const body: FluencyDocumentType[] = await response.json();
        console.log("Document types",JSON.stringify(body, null, 2))
        if (body) {
            return body.filter(x => x.businessLine.id.toString() === id).map(x => ({
                documentTypeId: x.id.toString(),
                documentTypeName: x.name
            }) as DocumentType)
        }

        throw new Error("No token received in response");
    } catch (error) {
        console.error("Error during login:", error);
        throw error; // Re-throw para que el llamador maneje el error
    }
}