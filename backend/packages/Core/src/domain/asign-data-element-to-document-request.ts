import { Credentials } from './Credentials';

/**
 * Request object for assigning a data element to a document type.
 * @property {Credentials} credentials - The authentication credentials for the Prodoctivity API.
 * @property {Object} assignDataElementToDocumentRequest - The request object for assigning a data element to a document type.
 * @property {string} assignDataElementToDocumentRequest.documentTypeId - The ID of the document type to which the data element will be assigned.
 * @property {Object} assignDataElementToDocumentRequest.dataElement - The data element to be assigned.
 * @property {string} assignDataElementToDocumentRequest.dataElement.name - The name of the data element.
 * @property {number} assignDataElementToDocumentRequest.dataElement.order - The order of the data element.
 */
export type AssignDataElementToDocumentRequest = {
  credentials: Credentials;
  assignDataElementToDocumentRequest: dataElementAssignationRequest;
};

export type dataElementAssignationRequest = {
  documentTypeId: string;
  dataElement: {
    name: string;
    order: number;
  };
};
