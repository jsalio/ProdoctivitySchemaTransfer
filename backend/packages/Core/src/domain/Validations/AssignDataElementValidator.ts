import { dataElementAssignationRequest } from '../asign-data-element-to-document-request';
import { ValidationError } from '../ValidationError';

export class AssignDataElementValidator {
  /**
   *
   */
  constructor(private readonly request: dataElementAssignationRequest) {}

  validate(): ValidationError<dataElementAssignationRequest>[] {
    const errors: ValidationError<dataElementAssignationRequest>[] = [];
    // Validate documentTypeId
    if (!this.request.documentTypeId || this.request.documentTypeId.trim() === '') {
      errors.push({ field: 'documentTypeId', message: 'Document type id is required' });
    }

    // Validate dataElement object presence
    if (!this.request.dataElement) {
      errors.push({ field: 'dataElement', message: 'Data element payload is required' });
      return errors;
    }

    // Validate dataElement.name
    if (!this.request.dataElement.name || this.request.dataElement.name.trim() === '') {
      errors.push({ field: 'dataElement', message: 'Data element name is required' });
    }

    // Validate dataElement.order
    const order = this.request.dataElement.order;
    if (order === undefined || order === null || Number.isNaN(order as unknown as number)) {
      errors.push({ field: 'dataElement', message: 'Data element order must be a number' });
    } else {
      if (!Number.isInteger(order)) {
        errors.push({ field: 'dataElement', message: 'Data element order must be an integer' });
      }
      if (order < 0) {
        errors.push({
          field: 'dataElement',
          message: 'Data element order must be greater or equal to 0',
        });
      }
    }
    return errors;
  }
}
