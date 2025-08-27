import { Credentials, Result, DocumentType } from "packages/Core/src";
import { getDocumentTypes } from "./getDocumentTypes";
import { generateShortGuid } from "./utils/random-guid";

export interface DocumentTypeOptions {
    status?: string;
    isTemplate?: boolean;
    useFullTextSearch?: boolean;
    icon?: {
        id?: string
    },
    format?: string,
}

const DEFAULT_OPTIONS: Required<DocumentTypeOptions> = {
    status: "Active",
    isTemplate: false,
    useFullTextSearch: false,
    icon: {
        id: "fa-archive"
    },
    format: "PDF"
}

export const createDocumentType = async (
    credential: Credentials,
    createDocumentTypeRequest:{
        name: string,
        buseinessFunctionId: string,
    },
    options: DocumentTypeOptions = {}
): Promise<Result<DocumentType, Error>> => {
    // console.log("Request for document type creation in Prodoctivity Fluency:", JSON.stringify({credential, createDocumentTypeRequest, options}, null, 2))
    if (!createDocumentTypeRequest.name?.trim()) {
        return {
            ok: false,
            error: new Error("Document type name cannot be empty")
        };
    }

    if (!createDocumentTypeRequest.buseinessFunctionId?.trim()) {
        return {
            ok: false,
            error: new Error("Business function ID cannot be empty")
        };
    }

    try {
        // console.log ("request for document type creation:", JSON.stringify({credential, createDocumentTypeRequest, options}, null, 2))
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("x-api-key", credential.serverInformation.apiKey);

        const basicAuthText = `${credential.username}@prodoctivity capture:${credential.password}`;
        headers.append("Authorization", `Basic ${btoa(basicAuthText)}`);

        const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
        const shortGuid = generateShortGuid();
        const requestBody = {
            name: createDocumentTypeRequest.name.trim()+shortGuid,
            businessLine:{
                id: createDocumentTypeRequest.buseinessFunctionId
            },
            ...mergedOptions
        };

        const requestOptions: RequestInit = {
            method: "POST",
            headers,
            body: JSON.stringify(requestBody),
            redirect: "follow"
        };
        // console.log("requestOptions for document type creation:", JSON.stringify(requestOptions, null, 2)) 
        const response = await fetch(
            `${credential.serverInformation.server}/site/api/v0.1/document-types?infoOnly=true`,
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
        await response.json();
        let documentTypes = await getDocumentTypes(credential,createDocumentTypeRequest.buseinessFunctionId)
        let dt:DocumentType|undefined
        documentTypes.forEach((x)=>{
            if(x.documentTypeName === createDocumentTypeRequest.name+shortGuid){
                dt = {
                    documentTypeId: x.documentTypeId,
                    documentTypeName: x.documentTypeName
                }
            }
        })
        if(!dt){
            return {
                ok: false,
                error: new Error("Document type not created")
            };
        }
        return {
            ok: true,
            value:dt
        }
    }
    catch (error) {
        return {
            ok: false,
            error: error instanceof Error
                ? error
                : new Error('An unknown error occurred while creating the document type')
        };
    }
}