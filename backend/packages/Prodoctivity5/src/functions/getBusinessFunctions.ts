///api/business-functions
import { Credentials, DocumentGroup } from "@schematransfer/core";

import { getDataElements } from "./getDataElements";

export type FluencyDocumentGroup = {
    id: number,
    description: string
}

/**
 * 
 * @param credential 
 * @returns 
 */
export const getBusinessFunctions = async (credential: Credentials): Promise<any> => {
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


        const response = await fetch(`${credential.serverInformation.server}/site/api/v0.1/business-functions`, requestOptions);
        const body: FluencyDocumentGroup[] = await response.json();
        if (body) {
            return body.map(x => ({
                groupName: x.description,
                groupId: x.id.toString(),
                documentTypesCounter: 0
            }) as DocumentGroup)
        }

        throw new Error("No token received in response");
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
}