import { Credentials, Result, DocumentType } from 'packages/Core/src';
import { getDocumentTypes } from './getDocumentTypes';
import { DocumentTypeOptions } from '../types/DocumentTypeOptions';

const DEFAULT_OPTIONS: Required<DocumentTypeOptions> = {
  status: 'Active',
  isTemplate: false,
  useFullTextSearch: false,
  icon: {
    id: 'fa-archive',
  },
  format: 'PDF',
};

export const createDocumentType = async (
  credential: Credentials,
  createDocumentTypeRequest: {
    name: string;
    businessFunctionId: string;
  },
  options: DocumentTypeOptions = {},
): Promise<Result<DocumentType, Error>> => {
  if (!createDocumentTypeRequest.name?.trim()) {
    return {
      ok: false,
      error: new Error('Document type name cannot be empty'),
    };
  }

  if (!createDocumentTypeRequest.businessFunctionId?.trim()) {
    return {
      ok: false,
      error: new Error('Business function ID cannot be empty'),
    };
  }

  try {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('x-api-key', credential.serverInformation.apiKey);

    const basicAuthText = `${credential.username}@prodoctivity capture:${credential.password}`;
    headers.append('Authorization', `Basic ${btoa(basicAuthText)}`);

    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
    // const shortGuid = generateShortGuid(); //add for debbug
    const requestBody = {
      name: createDocumentTypeRequest.name.trim(), //+shortGuid,
      businessLine: {
        id: createDocumentTypeRequest.businessFunctionId,
      },
      ...mergedOptions,
    };

    const requestOptions: RequestInit = {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
      redirect: 'follow',
    };
    // console.log("requestOptions for document type creation:", JSON.stringify(requestOptions, null, 2))
    const response = await fetch(
      `${credential.serverInformation.server}/site/api/v0.1/document-types?infoOnly=true`,
      requestOptions,
    );
    // console.log("Creating document type ")
    if (!response.ok) {
      // console.log("Error creating document type ")
      // let errorMessage = `API request failed with status ${response.status}`;
      // try {
      //     console.log ("Fail request try to open body")
      //     const errorBody = await response.json();
      //     errorMessage = errorBody.message || errorMessage;
      // } catch (e) {
      //     console.log ("Fail open body")
      //     // If we can't parse the error body, use the status text
      //     errorMessage = response.statusText || errorMessage;
      // }
      // console.log(errorMessage)
      // return {
      //     ok: false,
      //     error: new Error(errorMessage)
      // };
      // console.log("Error creating document type - Status:", response.status);
      // console.log("Error creating document type - StatusText:", response.statusText);
      // console.log("Response headers:", Object.fromEntries(response.headers.entries()));

      // let errorMessage:any = `API request failed with status ${response.status}`;
      // let errorDetails = null;

      // try {
      //     // Primero verifica el content-type
      //     const contentType = response.headers.get('content-type');
      //     console.log("Content-Type:", contentType);

      //     if (contentType?.includes('application/json')) {
      //         console.log("Trying to parse JSON error body");
      //         errorDetails = await response.json();
      //         console.log("Error body (JSON):", JSON.stringify(errorDetails, null, 2));
      //         errorMessage = errorDetails.message || errorDetails.error || JSON.stringify(errorDetails);
      //         // console.log('Respuesta json string')
      //     } else {
      //         console.log("Trying to parse text error body");
      //         errorDetails = await response.text();
      //         console.log("Error body (text):", errorDetails);
      //         errorMessage = errorDetails || response.statusText || errorMessage;
      //     }
      // } catch (parseError) {
      //     console.log("Failed to parse error body:", parseError);
      //     console.log("Using status text as fallback");
      //     errorMessage = response.statusText || errorMessage;

      //     // Intenta leer como texto si JSON falla
      //     try {
      //         const textBody = await response.text();
      //         console.log("Raw error body:", textBody);
      //         if (textBody) errorMessage += ` - ${textBody}`;
      //     } catch (textError) {
      //         console.log("Could not read response body at all:", textError);
      //     }
      // }
      // let msg:string =""
      // let n = JSON.parse(errorMessage)
      // msg = n.name[0]
      // return {
      //     ok: false,
      //     error: new Error(msg)
      // };
      console.log('Error creating document type - Status:', response.status);

      let finalMessage = `API request failed with status ${response.status}`;

      try {
        const contentType = response.headers.get('content-type');

        if (contentType?.includes('application/json')) {
          const errorBody = await response.json();
          console.log('Error body:', errorBody);

          // Extrae el mensaje específico del error
          if (errorBody.name && Array.isArray(errorBody.name) && errorBody.name.length > 0) {
            finalMessage = errorBody.name[0]; // "Duplicated"
          } else if (errorBody.message) {
            finalMessage = errorBody.message;
          } else if (errorBody.error) {
            finalMessage = errorBody.error;
          }
        } else {
          const textBody = await response.text();
          if (textBody) finalMessage = textBody;
        }
      } catch (e) {
        console.log('Could not parse error body:', e);
      }

      console.log('Final error message:', finalMessage);
      return {
        ok: false,
        error: new Error(finalMessage),
      };
    }
    await response.json();
    let documentTypes = await getDocumentTypes(
      credential,
      createDocumentTypeRequest.businessFunctionId,
    );
    if (!documentTypes.ok) {
      return {
        ok: false,
        error: new Error('Not determinated if document type is created'),
      };
    }
    let dt: DocumentType | undefined;
    documentTypes.value.forEach((x) => {
      if (x.documentTypeName === createDocumentTypeRequest.name) {
        dt = {
          documentTypeId: x.documentTypeId,
          documentTypeName: x.documentTypeName,
        };
      }
    });
    if (!dt) {
      return {
        ok: false,
        error: new Error('Document type not created'),
      };
    }
    return {
      ok: true,
      value: dt,
    };
  } catch (error) {
    console.log('Jump here');
    return {
      ok: false,
      error:
        error instanceof Error
          ? error
          : new Error('An unknown error occurred while creating the document type'),
    };
  }
};
