import { AppCodeError } from '../domain/AppCodeError';
import { CreateDocumentGroupRequest } from '../domain/create-group-request';
import { DocumentGroup } from '../domain/DocumentGroup';
import { LoginValidator } from '../domain/Validations/LoginValidator';
import { IRequest } from '../ports/IRequest';
import { IStore } from '../ports/IStore';
import { CoreResult } from '../ports/Result';

/**
 * Use case for creating a new document group in the system.
 * Handles the validation and execution of the document group creation process.
 */
export class CreateDocumentGroup {
  /**
   * Creates an instance of CreateDocumentGroup.
   * @param request - The request containing document group details and user credentials.
   * @param store - The storage interface for persisting document groups.
   */
  constructor(
    private readonly request: IRequest<CreateDocumentGroupRequest>,
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
   * Executes the document group creation process.
   * @returns A promise that resolves to a CoreResult containing the created DocumentGroup on success,
   *          or an error if the operation fails.
   */
  async execute(): Promise<CoreResult<DocumentGroup, AppCodeError, Error>> {
    if (!this.store.createDocumentGroup) {
      return {
        ok: false,
        code: AppCodeError.StoreError,
        error: new Error('Store does not implement createDocumentGroup method'),
      };
    }

    const request = this.request.build();
    const result = await this.store.createDocumentGroup(request.credentials, request.name);

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
