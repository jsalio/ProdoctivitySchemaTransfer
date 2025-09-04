import { Credentials } from './Credentials';

/**
 * Request object for retrieving a specific document group by its ID.
 */
export type GetDocumentGroupRequest = {
  /** Authentication credentials for the API request */
  credentials: Credentials;

  /** Unique identifier of the document group to retrieve */
  groupId: string;
};
