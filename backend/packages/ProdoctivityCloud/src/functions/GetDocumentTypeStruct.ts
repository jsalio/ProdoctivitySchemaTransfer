import { Credentials, SchemaDocumentType } from "@schematransfer/core";

import { CloudDocumentType } from "./GetDocumentGroups";

export interface CloudDocumentTypeSchema {
  documentType: DocumentType
}

export interface DocumentType {
  acceptedMimeTypes: string[]
  autoExtract: boolean
  documentTypeId: string
  documentTypeVersionId: string
  name: string
  contextDefinition: ContextDefinition
  wizardDefinition: WizardDefinition
  dataLinkMappings: any[]
  distributionMappings: any[]
  mySubscriptions: MySubscriptions
  permissions: Permission[]
  nameConfig: NameConfig[]
  identifierConfig: any[]
  identifierCollisionForcesNewVersion: boolean
  expirationWarningDays: number
  useFullTextIndex: boolean
  documentGroupName: string
  documentGroupId: string
  isFromContentLibrary: boolean
  author: string
  isPublished: boolean
  hasDataLinkDefinition: boolean
}

export interface ContextDefinition {
  records: any[]
  fields: Field[]
}

export interface Field {
  name: string
  humanName: string
  fullPath: string
  properties: Properties
}

export interface Properties {
  description: string
  humanName: string
  instructions: string
  label: string
  controlSize: string
  isUnique: boolean
  dataType: string
  minOccurs: number
  maxOccurs: number
  sampleValue: string[]
  inputType: string
  autoCompleteValues?: boolean
  listHasLabels?: boolean
  valueList?: ValueList[]
  dictionaryListId?: string
  dictionaryListPath?: any[]
  defaultValue?: string[]
}

export interface ValueList {
  label: string
  value: string
}

export interface WizardDefinition {
  defaultPageName: string
  defaultSectionName: string
  dependencies: any[]
  inferredDependencies: any[]
  pages: Page[]
}

export interface Page {
  key: string
  description: string
  label: string
  properties: Properties2
  sections: Section[]
}

export interface Properties2 { }

export interface Section {
  key: string
  description: string
  label: string
  properties: Properties3
  fields: Field2[]
}

export interface Properties3 { }

export interface Field2 {
  isRecord: boolean
  key: string
  label: string
}

export interface MySubscriptions {
  generation: Generation
  update: Update
}

export interface Generation {
  sendToWeb: boolean
  sendToMobile: boolean
}

export interface Update {
  sendToWeb: boolean
  sendToMobile: boolean
}

export interface Permission {
  roleId: string
  permissions: string[]
}

export interface NameConfig {
  type: string
  name?: string
  dataType?: string
  value?: string
}



export const GetDocumentTypeStruct = async (credential: Credentials, documentTYpeId: string): Promise<SchemaDocumentType> => {
  try {


    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${credential.token}`)
    headers.append("x-api-key", credential.serverInformation.apiKey)
    headers.append("api-secret", credential.serverInformation.apiSecret)

    const requestOptions: RequestInit = {
      method: "GET",
      headers: headers,
      //body: JSON.stringify(request),
      redirect: "follow"
    };

    const response = await fetch(`${credential.serverInformation.server}/api/document-types/${documentTYpeId}?withFormLayout=false`, requestOptions);
    if (!response.ok) {
      throw new Error(`Login failed with status ${response.status}: ${response.statusText}`);
    }

    const body: CloudDocumentTypeSchema = await response.json();
    // console.log(JSON.stringify(body, null, 2))
    if (response.status === 200) {
      // console.log('Return here 1')
      return {
        name: body.documentType.name,
        documentTypeId: body.documentType.documentTypeId,
        keywords: body.documentType.contextDefinition.fields.map(key => ({
          name: key.name,
          label: key.humanName,
          dataType: key.properties.dataType,
          require:key.properties.minOccurs >= 1
        }))
      } as any
    }
    // console.log('Return here 2')
    return {} as any;
  } catch (error) {
    console.error("Error during login:", error);
    throw error; // Re-throw para que el llamador maneje el error
  }
}