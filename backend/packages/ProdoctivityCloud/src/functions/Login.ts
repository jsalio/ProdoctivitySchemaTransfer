import { Credentials } from "@schematransfer/core";

/**
 * 
 * @param credential 
 * @returns 
 */
export const LoginToProdoctivity = async (credential: Credentials):Promise<string> => {
        try {
        const request = {
            username: credential.username,
            password: credential.password,
            organizationId: credential.serverInformation.organization
        };

        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const requestOptions: RequestInit = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(request),
            redirect: "follow"
        };

        const response = await fetch(`${credential.serverInformation.server}/api/login`, requestOptions);
        if (!response.ok) {
            throw new Error(`Login failed with status ${response.status}: ${response.statusText}`);
        }

        const body = await response.json();        
        if (response.status === 200 && body.token) {
            return body.token;
        }
        
        throw new Error("No token received in response");
    } catch (error) {
        console.error("Error during login:", error);
        throw error; // Re-throw para que el llamador maneje el error
    }
}