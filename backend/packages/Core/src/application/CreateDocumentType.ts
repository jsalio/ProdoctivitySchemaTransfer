import { AppCodeError } from '../domain/AppCodeError';
import { CreateDocumentTypeRequest } from '../domain/Create-document-type-request';
import { DocumentType } from '../domain/DocumentType';
import { LoginValidator } from '../domain/Validations/LoginValidator';
import { IRequest } from '../ports/IRequest';
import { IStore } from '../ports/IStore';
import { CoreResult } from '../ports/Result';

/**
 * Use case for creating a new document type in the system.
 * Handles the validation and execution of the document type creation process.
 */
export class CreateDocumentType {
  /**
   * Creates an instance of CreateDocumentType.
   * @param request - The request containing document type details and user credentials.
   * @param store - The storage interface for persisting document types.
   */
  constructor(
    private readonly request: IRequest<CreateDocumentTypeRequest>,
    private readonly store: IStore,
  ) {}

  /**
   * Validates the request credentials.
   * @returns An array of validation errors, or an empty array if validation passes.
   */
  validate() {
    const validations = new LoginValidator(this.request.build().credentials);
    const errors = validations.Validate();
    return errors;
  }

  /**
   * Executes the document type creation process.
   * @returns A promise that resolves to a CoreResult containing the created DocumentType on success,
   *          or an error if the operation fails.
   */
  async execute(): Promise<CoreResult<DocumentType, AppCodeError, Error>> {
    if (!this.store.createDocumentType) {
      return {
        ok: false,
        code: AppCodeError.StoreError,
        error: new Error('Store does not implement createDocumentType method'),
      };
    }

    const request = this.request.build();
    const result = await this.store.createDocumentType(request.credentials, {
      name: request.createDocumentTypeRequest.name,
      businessFunctionId: request.createDocumentTypeRequest.documentGroupId,
    });

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
