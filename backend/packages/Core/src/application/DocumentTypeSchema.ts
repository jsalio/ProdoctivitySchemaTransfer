import { Credentials } from '../domain/Credentials';
import { IRequest } from '../ports/IRequest';
import { IStore } from '../ports/IStore';
import { LoginValidator } from '../domain/Validations/LoginValidator';
import { SchemaDocumentType } from '../domain/SchemaDocumentType';
import { CoreResult } from '../ports/Result';
import { AppCodeError } from '../domain/AppCodeError';
import { GetDocumentTypeSchemaRequest } from '../domain/GetDocumentTypeSchemaRequest';
import { ValidationError } from '../domain/ValidationError';

/**
 * Handles the retrieval of a document type schema based on the provided credentials and document type ID.
 * This class is responsible for validating the request and fetching the schema from the store.
 */
export class GetDocumentTypeSchema {
  /**
   * Creates a new instance of GetDocumentTypeSchema
   * @param request - The request object containing credentials and document type ID
   * @param store - The store interface for data access operations
   */
  constructor(
    private readonly request: IRequest<GetDocumentTypeSchemaRequest>,
    private readonly store: IStore,
  ) {}

  /**
   * Validates the request by checking the provided credentials
   * @returns An array of validation errors, if any
   */
  validate() {
    let request = this.request.build();
    let validationErrors: ValidationError<GetDocumentTypeSchemaRequest>[] = [];
    const validations = new LoginValidator(this.request.build().credentials);
    const errors = validations.Validate();
    if (request.documentTypeId === '') {
      validationErrors.push({ field: 'credentials', message: 'Invalid name for group' });
    }
    return [...validationErrors, ...errors];
  }

  /**
   * Executes the document type schema retrieval operation
   * @returns A promise that resolves to an object containing the schema or an error message
   */
  async execute(): Promise<CoreResult<SchemaDocumentType, AppCodeError, Error>> {
    const request = this.request.build();
    const result = await this.store.getDocumentTypeSchema(
      request.credentials,
      request.documentTypeId,
    );

    if (!result.ok) {
      return {
        ok: false,
        code: AppCodeError.StoreError,
        error: result.error,
      };
    }
    return result;
  }
}
