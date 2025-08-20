import { Credentials } from "@schematransfer/core";

/**
 * 
 * @param credential 
 * @returns 
 */
export const LoginToProdoctivity = async (credential: Credentials): Promise<string> => {
    try {

        const headers = new Headers();
        //headers.append("Content-Type", "application/json");
        headers.append("x-api-key", credential.serverInformation.apiKey)
        headers.append("Authorization", `Basic ${btoa(`${credential.username}:${credential.password}`)}`)

        const requestOptions: RequestInit = {
            method: "POST",
            headers: headers,
            //body: JSON.stringify(request),
            redirect: "follow"
        };

        console.log(JSON.stringify(requestOptions))

        const response = await fetch(`${credential.serverInformation.server}/site/api/v1/auth/session`, requestOptions);
        if (!response.ok) {
            throw new Error(`Login failed with status ${response.status}: ${response.statusText}`);
        }
        console.log(response.status, response.statusText)

        if (response.status >= 200 && response.status <=299 ) {
            return "Ok"
        }

        throw new Error("No token received in response");
    } catch (error) {
        console.error("Error during login:", error);
        throw error; // Re-throw para que el llamador maneje el error
    }
}