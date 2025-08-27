import { Credentials, DataElement, Result } from "@schematransfer/core";
import { generateShortGuid } from "../utils/random-guid";
import { DataType, GetDataTypeByString, MiddleWareToProdoctivityDictionary } from "../utils/dataType";
import { getDataElements } from "../getDataElements";

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
    console.log('request on middleware:', JSON.stringify(createKeywordRequest, null, 2))    
    if (!createKeywordRequest.name?.trim()) {
        return {
            ok: false,
            error: new Error("Keyword name cannot be empty")
        };
    }
    try {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("x-api-key", credential.serverInformation.apiKey);

        const basicAuthText = `${credential.username}@prodoctivity capture:${credential.password}`;
        headers.append("Authorization", `Basic ${btoa(basicAuthText)}`);

        const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

        const generateName = createKeywordRequest.name.trim()+generateShortGuid(); //use for debug

        const requestBody = {
            name: generateName,
            required: false,//createKeywordRequest.require,
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
        console.log("Creando llave :",requestBody);
        const response = await fetch(
            `${credential.serverInformation.server}/site/api/v0.1/dictionary/data-elements`,
            requestOptions
        );

        if (!response.ok) {
            console.log('response:', response)
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
        const listOfDataElements = await getDataElements(credential);

        const dataElement = listOfDataElements.find((x: any) => x.name === generateName);

        if (!dataElement){
            return {
                ok: false,
                error: new Error("Data element not found")
            };
        }


        return {
            ok: true,
            value: { 
                id: dataElement.id,
                name: dataElement.name,
                dataType: dataElement.dataType,
                required: dataElement.required,
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
