///api/business-functions
import { Credentials, DocumentGroup, DocumentType } from "@schematransfer/core";

export type FluencyDocumentTypeSchema = {
    id: number,
    name: string,
    businessLine: {
        id: number,
        name: string
    },
    keywords: {
        name: string,
        humanName: string,
        definition: {
            humanName: string,
            properties: {
                name: string,
                dataType: string
            }
        }
    }[]
}

/**
 * 
 * @param credential 
 * @returns 
 */
export const getDocumentTypeSchema = async (credential: Credentials, documentTypeId: string): Promise<any> => {
    try {
        const headers = new Headers();
        headers.append("x-api-key", credential.serverInformation.apiKey)
        const basicAuthText = `${credential.username + "@prodoctivity capture"}:${credential.password}`
        headers.append("Authorization", `Basic ${btoa(basicAuthText)}`);

        const requestOptions: RequestInit = {
            method: "GET",
            headers: headers,
            redirect: "follow"
        };

        const response = await fetch(`${credential.serverInformation.server}/site/api/v2/document-types`, requestOptions);

        const body: FluencyDocumentTypeSchema[] = await response.json();
        console.log("Document types", JSON.stringify(body, null, 2))
        if (body) {
            return body.filter(x => x.id.toString() === documentTypeId).map(x => ({
                name: x.name,
                documentTypeId: x.id,
                keywords: x.keywords.map(key => ({
                    name: key.name,
                    label: key.humanName,
                    dataType: key.definition.properties.dataType,
                    require: false
                }))
            }) as any)[0]
        }

        throw new Error("No token received in response");
    } catch (error) {
        console.error("Error during login:", error);
        throw error; // Re-throw para que el llamador maneje el error
    }
}