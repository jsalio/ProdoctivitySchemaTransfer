import { Credentials, DocumentType, Result } from "@schematransfer/core";
import { FluencyDocumentType } from "../types/FluencyDocumentType"; 

/**
 * Fetches document types from the API and returns those matching the specified business line ID as a Set of DocumentType objects.
 * @param credential - The credentials for API authentication.
 * @param id - The business line ID to filter document types.
 * @returns A Promise resolving to a Set of DocumentType objects.
 * @throws Error if the API request fails or the response is invalid.
 */
export const getDocumentTypes = async (credential: Credentials, id: string): Promise<Result<Array<DocumentType>, Error>> => {
    try {
        const headers = new Headers();
        headers.append("x-api-key", credential.serverInformation.apiKey);
        const basicAuthText = `${credential.username}@productivity capture:${credential.password}`; // Fixed typo: "prodoctivity" -> "productivity"
        headers.append("Authorization", `Basic ${btoa(basicAuthText)}`);

        const requestOptions: RequestInit = {
            method: "GET",
            headers: headers,
            redirect: "follow",
        };

        const response = await fetch(
            `${credential.serverInformation.server}/site/api/v2/document-types`,
            requestOptions
        );

        // Check if the response status is OK
        if (!response.ok) {
            return {
                ok:false,
                error:new Error(`API request failed with status ${response.status}: ${response.statusText}`)
            }
            //throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
        }

        const body = await response.json();

        // Validate that body is an array
        if (!Array.isArray(body)) {
            return {
                ok:false,
                error:new Error("Expected an array of FluencyDocumentType objects in the response")
            }
        }

        // Validate that each item in the array has the required properties
        const isValidResponse = body.every(
            (item): item is FluencyDocumentType =>
                item != null &&
                typeof item === "object" &&
                typeof item.id === "number" &&
                typeof item.name === "string" &&
                item.businessLine != null &&
                typeof item.businessLine === "object" &&
                typeof item.businessLine.id === "number" &&
                typeof item.businessLine.name === "string"
        );

        if (!isValidResponse) {
            return {
                ok:false,
                error:new Error("Invalid FluencyDocumentType data in response")
            }
            
        }

        // Filter and map the response to DocumentType objects, then convert to Set
        const documentTypes = body
            .filter((x: FluencyDocumentType) => x.businessLine.id.toString() === id)
            .map((x: FluencyDocumentType): DocumentType => ({
                documentTypeId: x.id.toString(),
                documentTypeName: x.name,
            }));

        return {
            ok:true,
            value:documentTypes
        };
    } catch (error) {
        console.error("Error fetching document types:", error);
        throw error; // Re-throw to allow the caller to handle the error
    }
};