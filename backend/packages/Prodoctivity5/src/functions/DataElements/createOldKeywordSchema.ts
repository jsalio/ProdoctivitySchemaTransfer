import { Credentials, Result } from "packages/Core/src";

interface CreateOldKeywordResponse {
    id: number,
}

export const createOldKeywordSchema = async (
    credential: Credentials,
    dataElemet: any): Promise<Result<CreateOldKeywordResponse, Error>> => {

    if (dataElemet.name?.trim()) {
        return {
            ok: false,
            error: new Error("Keyword name cannot be empty")
        };
    }

    if (dataElemet.id?.trim()) {
        return {
            ok: false,
            error: new Error("Keyword ID cannot be empty")
        };
    }
    try {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("x-api-key", credential.serverInformation.apiKey);

        const basicAuthText = `${credential.username}@prodoctivity capture:${credential.password}`;
        headers.append("Authorization", `Basic ${btoa(basicAuthText)}`);

        const requestOptions: RequestInit = {
            method: "POST",
            headers,
            body: JSON.stringify(dataElemet),
            redirect: "follow"
        };

        const response = await fetch(
            `${credential.serverInformation.server}/site/api/v0.1/dictionary/data-elements/map-old-schema`,
            requestOptions
        );

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

        return {
            ok: true,
            value: await response.json()
        };
    } catch (error) {
        return {
            ok: false,
            error: error instanceof Error
                ? error
                : new Error('An unknown error occurred while creating the keyword in old schema')
        };
    }

}

