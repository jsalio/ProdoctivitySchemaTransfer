import { Credentials, DataElement, Result } from "@schematransfer/core";

interface CreateDataElementResponse {
    id: number,
    description: string,
}

interface KeywordOptions {
    TopicName?: string,
    CultureLanguageName?: string,
    unique?: boolean,
    defaultValue?: {},
    IsReferenceField?: boolean,
    NotVisibleOnDocument?: boolean,
    ReadOnly?: boolean,
    Autocomplete?: boolean,
}

const DEFAULT_OPTIONS: Required<KeywordOptions> = {
    TopicName: "General",
    CultureLanguageName: "Spanish - Dominican Republic",
    unique: false,
    defaultValue: {},
    IsReferenceField: false,
    NotVisibleOnDocument: false,
    ReadOnly: false,
    Autocomplete: false,
}


export const createKeyword = async (
    credential: Credentials,
    createKeywordRequest: {
        name: string,
        documentTypeId: string,
        dataType: string,
        require: boolean,
    },
    options: KeywordOptions = {}
): Promise<Result<DataElement, Error>> => {
    if (!createKeywordRequest.name?.trim()) {
        return {
            ok: false,
            error: new Error("Keyword name cannot be empty")
        };
    }
    if (!createKeywordRequest.documentTypeId?.trim()) {
        return {
            ok: false,
            error: new Error("Document type ID cannot be empty")
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
            name: createKeywordRequest.name.trim(),
            required: createKeywordRequest.require,
            question: createKeywordRequest.name.trim(),
            instructions: createKeywordRequest.name.trim(),
            Definition: createKeywordRequest.name.trim(),
            alternativeQuestion: createKeywordRequest.name.trim(),
            dataType: MiddleWareToProdoctivityDictionary.get(GetDataTypeByString(createKeywordRequest.dataType))!,
            sampleValue:getSampleValue(GetDataTypeByString(createKeywordRequest.dataType)),
            ...mergedOptions
        };

        const requestOptions: RequestInit = {
            method: "POST",
            headers,
            body: JSON.stringify(requestBody),
            redirect: "follow"
        };

        const response = await fetch(
            `${credential.serverInformation.server}/site/api/v0.1/dictionary/data-element`,
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

        const body: CreateDataElementResponse = await response.json();

        return {
            ok: true,
            value: { 
                id: body.id.toString(),
                name: createKeywordRequest.name.trim(),
                dataType: createKeywordRequest.dataType,
                required: createKeywordRequest.require.toString(),
             }
        };
    }
    catch (error) {
        return {
            ok: false,
            error: error instanceof Error
                ? error
                : new Error('An unknown error occurred while creating the keyword')
        };
    }
}

function getSampleValue(dataType: DataType) {
    switch (dataType) {
        case DataType.Alphanumeric:
            return "Sample Value";
        case DataType.Numeric:
            return 1;
        case DataType.Decimal:
            return 1.1;
        case DataType.Boolean:
            return true;
        case DataType.Date:
            return new Date();
        case DataType.DateTime:
            return new Date();
    }
}
