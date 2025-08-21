///api/business-functions
import { Credentials, DocumentGroup } from "@schematransfer/core";

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
        //headers.append("Content-Type", "application/json");
        headers.append("x-api-key", credential.serverInformation.apiKey)
        const basicAuthText=`${credential.username+"@prodoctivity capture"}:${credential.password}`
        headers.append("Authorization", `Basic ${btoa(basicAuthText)}`);
        // headers.append("Authorization", `Basic ${btoa(`${credential.username+"@prodoctivity capture"}:${credential.password}`)}`)

        const requestOptions: RequestInit = {
            method: "GET",
            headers: headers,
            //body: JSON.stringify(request),
            redirect: "follow"
        };
        // //console.log(JSON.stringify(requestOptions))

        const response = await fetch(`${credential.serverInformation.server}/site/api/v0.1/business-functions`, requestOptions);
        // if (response.status >= 200 && response.status <= 299) {
        //     return "Ok"
        // }

        const body: FluencyDocumentGroup[] = await response.json();
        // console.log(JSON.stringify(body, null, 2))
        // console.log('Response', response)
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
        throw error; // Re-throw para que el llamador maneje el error
    }
}