import { Credentials } from "@schematransfer/core" 
import { FluencyDataElement } from "../types/FluencyDataElement"  

export const getDataElements = async (credential:Credentials):Promise<any> => {
    try{
        const headers = new Headers();
        headers.append("x-api-key", credential.serverInformation.apiKey)
        const basicAuthText=`${credential.username+"@prodoctivity capture"}:${credential.password}`
        headers.append("Authorization", `Basic ${btoa(basicAuthText)}`);

        const requestOptions: RequestInit = {
            method: "GET",
            headers: headers,
            redirect: "follow"
        };
        const response = await fetch(`${credential.serverInformation.server}/site/api/v0.1/dictionary/data-elements`, requestOptions);
        if (response.status<199 && response.status>299){
            throw new Error("No response received.");
        }
        const body:FluencyDataElement[] = await response.json();
        // console.log(JSON.stringify(body, null, 2))
        return body.map(x => ({
            id: x.id.toString(),
            name: x.name,
            dataType: x.dataType,
            required: x.required,
        }))
    }
    catch(error){
        console.error("Error during login:", error);
        throw error; // Re-throw para que el llamador maneje el error
    }
}