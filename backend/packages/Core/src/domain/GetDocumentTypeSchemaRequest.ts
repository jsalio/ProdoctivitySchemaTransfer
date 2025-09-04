import { Credentials } from './Credentials';

/**
 * Request object for retrieving the schema of a specific document type.
 */
export type GetDocumentTypeSchemaRequest = {
  /** Authentication credentials for the API request */
  credentials: Credentials;

  /** Unique identifier of the document type whose schema is being requested */
  documentTypeId: string;
};
