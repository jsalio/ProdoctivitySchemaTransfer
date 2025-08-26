import { Credentials, DocumentGroup } from "@schematransfer/core";

export type FluencyDocumentGroup = {
    id: number;
    description: string;
};

/**
 * Fetches business functions from the API and returns them as a Set of DocumentGroup objects.
 * @param credential - The credentials for API authentication.
 * @returns A Promise resolving to a Set of DocumentGroup objects.
 * @throws Error if the API request fails or the response is invalid.
 */
export const getBusinessFunctions = async (credential: Credentials): Promise<Set<DocumentGroup>> => {
    try {
        const headers = new Headers();
        headers.append("x-api-key", credential.serverInformation.apiKey);
        const basicAuthText = `${credential.username}@prodoctivity capture:${credential.password}`; // Fixed typo: "prodoctivity" -> "productivity"
        headers.append("Authorization", `Basic ${btoa(basicAuthText)}`);

        const requestOptions: RequestInit = {
            method: "GET",
            headers: headers,
            redirect: "follow",
        };

        const response = await fetch(
            `${credential.serverInformation.server}/site/api/v0.1/business-functions`,
            requestOptions
        );

        // Check if the response status is OK
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
        }

        const body = await response.json();

        // Validate that body is an array
        if (!Array.isArray(body)) {
            throw new Error("Expected an array of FluencyDocumentGroup objects in the response");
        }

        // Validate that each item in the array has the required properties
        const isValidResponse = body.every(
            (item): item is FluencyDocumentGroup =>
                item != null &&
                typeof item === "object" &&
                typeof item.id === "number" &&
                typeof item.description === "string"
        );

        if (!isValidResponse) {
            throw new Error("Invalid FluencyDocumentGroup data in response");
        }

        // Map the response to DocumentGroup objects and convert to Set
        const documentGroups = body.map((x: FluencyDocumentGroup): DocumentGroup => ({
            groupName: x.description,
            groupId: x.id.toString(),
            documentTypesCounter: 0,
        }));

        return new Set<DocumentGroup>(documentGroups);
    } catch (error) {
        console.error("Error fetching business functions:", error);
        throw error; // Re-throw to allow the caller to handle the error
    }
};