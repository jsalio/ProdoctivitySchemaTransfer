import { Credentials, Result, SchemaDocumentType } from "@schematransfer/core";
import { CloudDocumentTypeSchema } from "../types/CloudDocumentTypeSchema";

export const GetDocumentTypeStruct = async (credential: Credentials, documentTYpeId: string): Promise<Result<SchemaDocumentType, Error>> => {
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
      //throw new Error(`Login failed with status ${response.status}: ${response.statusText}`);
      return {
        ok: false,
        error: new Error(`Login failed with status ${response.status}: ${response.statusText}`)
      }
    }

    const body: CloudDocumentTypeSchema = await response.json();
    if (response.status === 200) {
      return {
        ok: true,
        value: {
          name: body.documentType.name,
          documentTypeId: body.documentType.documentTypeId,
          keywords: body.documentType.contextDefinition.fields.map(key => ({
            name: key.name,
            label: key.humanName,
            dataType: key.properties.dataType,
            require: key.properties.minOccurs >= 1
          }))
        }
      }
    }
    return {
      ok: false,
      error: new Error("Keyword not found")
    }
  } catch (error) {
    return {
      ok: false,
      error: error as Error
    }
  }
}