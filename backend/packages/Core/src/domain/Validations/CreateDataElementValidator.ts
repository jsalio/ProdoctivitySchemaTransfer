import { DataElementCreationRequest } from '../Create-data-element-request';
import { ValidationError } from '../ValidationError';

export class CreateDataElementValidator {
  /**
   *
   */
  constructor(private readonly dataElementRequest: DataElementCreationRequest) {}

  validate(): ValidationError<DataElementCreationRequest>[] {
    const errors: ValidationError<DataElementCreationRequest>[] = [];
    if (this.dataElementRequest.dataType === '') {
      errors.push({ field: 'dataType', message: 'data type is not default' });
    }
    if (this.dataElementRequest.name === '') {
      errors.push({ field: 'name', message: 'Invalid data element name' });
    }
    return errors;
  }
}
