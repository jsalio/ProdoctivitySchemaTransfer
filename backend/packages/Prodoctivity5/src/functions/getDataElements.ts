import { Credentials, DataElement } from "@schematransfer/core"

export interface FluencyDataElement {
    id: number
    name: string
    dataType: string
    required: boolean
    sampleValue: string
    unique: boolean
    defaultValue: string
    question: string
    instructions: string
    definition: string
    cultureLanguageName: string
    topicName: string
    isReferenceField: boolean
    isSystemDate: boolean
    is12Hour: boolean
    notVisibleOnDocument: boolean
    readOnly: boolean
    autocomplete: boolean
    alternativeQuestions: string[]
    input: Input
    output: Output
    sequenceId: number
    oldSequenceId: number
  }
  
  export interface Input {
    controlType: string
    controlSize: string
    controlLayout: string
    keepAllMaskCharacters: boolean
    maxLength: number
    dateMinMaxType: string
  }
  
  export interface Output {
    conditionalStyles: any[]
    outputFormat: OutputFormat
    dataElementOrderType: string
    dataElementListSeparator: string
    dataElementPenultimateSeparator: string
    dataElementFinalizer: string
  }
  
  export interface OutputFormat {
    cultureAssociations: CultureAssociation[]
    format: string
    dataType: string
    description: string
  }
  
  export interface CultureAssociation {
    cultureLanguage?: CultureLanguage
    description?: string
  }
  
  export interface CultureLanguage {
    country: Country
    language: Language
    name: string
  }
  
  export interface Country {
    code: number
    longCode: string
    shortCode: string
    name: string
  }
  
  export interface Language {
    longCode: string
    shortCode: string
    name: string
  }

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