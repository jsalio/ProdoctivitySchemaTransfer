///api/business-functions
import { Credentials, Result, SchemaDocumentType } from "@schematransfer/core";
import { FluencyDocumentTypeSchema } from "../types/FluencyDocumentTypeSchema";

/**
 * 
 * @param credential 
 * @returns 
 */
export const getDocumentTypeSchema = async (credential: Credentials, documentTypeId: string): Promise<Result<SchemaDocumentType, Error>> => {
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
        console.log("Here ", response.status)
        if (response.status <= 200 && response.status >= 299) {
            return {
                ok: false,
                error: new Error("Invalid response")
            }
        }

        const body: FluencyDocumentTypeSchema[] = await response.json();
        if (body) {

            const targetDocumentType = body.filter(x => x.id.toString() === documentTypeId)[0]
            if (!targetDocumentType) {
                return {
                    ok: false,
                    error: new Error("Document type not found")
                }
            }

            const documentSchema: SchemaDocumentType = {
                name: targetDocumentType.name,
                documentTypeId: targetDocumentType.id.toString(),
                keywords: targetDocumentType.keywords.map(key => ({
                    name: key.name,
                    label: key.humanName,
                    dataType: key.definition.properties.dataType,
                    require: false
                }))
            }

            return {
                ok: true,
                value: documentSchema
            }
        }
        return {
            ok:false,
            error: new Error("Invalid body response")
        }
    } catch (error) {
        console.error("Error during login:", error);
        throw error; // Re-throw para que el llamador maneje el error
    }
}