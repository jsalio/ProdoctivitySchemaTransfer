import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

export class BaseService {
  /**
   *
   */
  constructor(
    private readonly CLIENT: HttpClient,
    private readonly resource: string,
  ) {}

  get Uri() {
    return `${environment.backendApi}/${this.resource}`;
  }
}
