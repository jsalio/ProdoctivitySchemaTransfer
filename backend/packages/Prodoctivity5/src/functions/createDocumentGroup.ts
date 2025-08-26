import { Credentials, DocumentGroup, Result } from "@schematransfer/core"

export interface DocumentGroupOptions {
    defaultWorkflowConfigurationId?: number;
    status?: string;
    comments?: string;
    type?: string;
}

export interface FluencyDocumentGroupResponse {
    id: number;
    description: string;
    name: string;
    status: string;
}

const DEFAULT_OPTIONS: Required<DocumentGroupOptions> = {
    defaultWorkflowConfigurationId: 1,
    status: "Active",
    comments: "Created by Schema Transfer App",
    type: ""
};

/**
 * Creates a new document group in the Prodoctivity system
 * @param credential - Authentication credentials for the Prodoctivity API
 * @param name - Name of the document group to create
 * @param options - Optional configuration for the document group
 * @returns A Result containing the created DocumentGroup or an Error
 */
export const createDocumentGroup = async (
    credential: Credentials,
    name: string,
    options: DocumentGroupOptions = {}
): Promise<Result<DocumentGroup, Error>> => {
    if (!name?.trim()) {
        return {
            ok: false,
            error: new Error("Document group name cannot be empty")
        };
    }

    try {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("x-api-key", credential.serverInformation.apiKey);

        const basicAuthText = `${credential.username}@prodoctivity capture:${credential.password}`;
        headers.append("Authorization", `Basic ${btoa(basicAuthText)}`);

        const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

        const requestBody = {
            description: name,
            name: name.trim(),
            ...mergedOptions
        };

        const requestOptions: RequestInit = {
            method: "POST",
            headers,
            body: JSON.stringify(requestBody),
            redirect: "follow"
        };

        const response = await fetch(
            `${credential.serverInformation.server}/site/api/v0.1/business-functions`,
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

        const body: FluencyDocumentGroupResponse = await response.json();

        return {
            ok: true,
            value: {
                documentTypesCounter: 0,
                groupId: body.id.toString(),
                groupName: body.name || name
            }
        };
    } catch (error) {
        return {
            ok: false,
            error: error instanceof Error
                ? error
                : new Error('An unknown error occurred while creating the document group')
        };
    }
};
