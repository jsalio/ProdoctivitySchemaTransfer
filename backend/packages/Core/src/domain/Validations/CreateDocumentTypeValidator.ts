import { DocumentTypeCreationRequest } from '../Create-document-type-request';
import { ValidationError } from '../ValidationError';

export class CreateDocumentTypeValidator {
  /**
   *
   */
  constructor(private readonly documentTypeRequest: DocumentTypeCreationRequest) {}

  validate(): ValidationError<DocumentTypeCreationRequest>[] {
    const errors: ValidationError<DocumentTypeCreationRequest>[] = [];
    if (this.documentTypeRequest.documentGroupId === '') {
      errors.push({ field: 'documentGroupId', message: 'Document group for assignation is empty' });
    }
    if (this.documentTypeRequest.name === '') {
      errors.push({ field: 'name', message: 'Invalid document type name' });
    }
    return errors;
  }
}
