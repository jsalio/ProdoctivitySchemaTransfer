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

        const n = () => {
            const myHeaders = new Headers();
            myHeaders.append("x-api-key", "d8092a8b-15a6-4f8e-87de-c582aa6445f9");
            // myHeaders.append("Authorization", "Basic bWFuYWdlckBwcm9kb2N0aXZpdHkgY2FwdHVyZTpwYXNzd29yZA==");
            myHeaders.append("Authorization", `Basic ${btoa(`manager@prodoctivity capture:password`)}`);
            //myHeaders.append("Cookie", ".ASPXAUTH=ED83E621F1743C0C9BA499CE9BC5B953BDA8FDF56A7C73FF8E5CE9ACDE0F337216FF6D2FC33F007FF1588552F216C4840DA55A53233A364B52125810282CF4EFF2483D20924617B81F380D2290FCD6FCADE7D5F511AEA20455FEB4BE1E80DBF6; ASP.NET_SessionId=n3cb1naftmkm55mairqotzjj");
            
            const requestOptions = {
              method: "GET",
              headers: myHeaders,
              redirect: "follow"
            } as any;
            
            fetch("http://44.195.185.144/site/api/v0.1/business-functions", requestOptions)
              .then((response) => response.text())
              .then((result) => console.log(result))
              .catch((error) => console.error(error));
        }
        //8n()
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
        console.log(JSON.stringify(body, null, 2))
        console.log('Response', response)
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