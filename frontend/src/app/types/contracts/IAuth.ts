import { Observable } from 'rxjs';

import { Credentials } from '../models/Credentials';

export interface IAuthBackend {
  login: (
    cedentials: Credentials,
  ) => Observable<{ data: { store: string; token: string }; success: boolean }>;
}
