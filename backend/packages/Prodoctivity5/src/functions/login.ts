import { Credentials, Result } from "@schematransfer/core";

/**
 * 
 * @param credential 
 * @returns 
 */
export const LoginToProdoctivity = async (credential: Credentials): Promise<Result<string, Error>> => {
    try {

        const headers = new Headers();
        headers.append("x-api-key", credential.serverInformation.apiKey)
        const basicAuthText = `${credential.username + "@prodoctivity capture"}:${credential.password}`
        headers.append("Authorization", `Basic ${btoa(basicAuthText)}`);

        const requestOptions: RequestInit = {
            method: "POST",
            headers: headers,
            redirect: "follow"
        };

        const response = await fetch(`${credential.serverInformation.server}/site/api/v1/auth/session`, requestOptions);
        if (!response.ok) {
            return {
                ok: false,
                error: new Error(`Login failed with status ${response.status}: ${response.statusText}`)
            }
        }

        if (response.status >= 200 && response.status <= 299) {
            return {
                ok: true,
                value: "ok"
            }
        }

        return {
            ok: false,
            error: new Error("No token received in response")
        }
    } catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error : new Error('An unknown error occurred while Login')
        }
    }
}