import { Credentials, Result } from "packages/Core/src";
import { AssignResponse } from "../types/AssignResponse";

export const assignKeywordToDoc = async (credential: Credentials, assignDataElementToDocumentTypeRequest: {
    documentTypeId: string,
    dataElement:{
        name: string,
        order: number,
    },
}):Promise<Result<boolean, Error>> => {
    // console.log('Assign keyword to document type:', JSON.stringify(assignDataElementToDocumentTypeRequest, null, 2))
    try{
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("x-api-key", credential.serverInformation.apiKey);

        const basicAuthText = `${credential.username}@prodoctivity capture:${credential.password}`;
        headers.append("Authorization", `Basic ${btoa(basicAuthText)}`);

        const requestOptions: RequestInit = {
            method: "POST",
            headers,
            body: JSON.stringify({
                keyName: assignDataElementToDocumentTypeRequest.dataElement.name.trim(),
                order: assignDataElementToDocumentTypeRequest.dataElement.order+1,
            }),
            redirect: "follow"
        };
        //console.log('Assign keyword to document type request:', requestOptions)

        const response = await fetch(
            `${credential.serverInformation.server}/Site/api/v0.1/dictionary/data-elements/assign-old-schema/${assignDataElementToDocumentTypeRequest.documentTypeId}`,
            requestOptions
        );

        //console.log('Assign keyword to document type response:', response)

        if (!response.ok) {
            let errorMessage = `API request failed with status ${response.status}`;
            try {
                const errorBody = await response.json();
                errorMessage = errorBody.message || errorMessage;
            } catch (e) {
                // If we can't parse the error body, use the status text
                errorMessage = response.statusText || errorMessage;
            }
            return {
                ok: false,
                error: new Error(errorMessage)
            };
        }
        let assignResponse:AssignResponse = await response.json();
        console.log('Assign keyword to document type response:', assignResponse)
        return {
            ok: true,
            value: assignResponse.result === 1 || assignResponse.result === 0
        };
    }
    catch(error){
        return {
            ok: false,
            error: error instanceof Error
                ? error
                : new Error('An unknown error occurred while assigning the keyword')
        };
    }
}