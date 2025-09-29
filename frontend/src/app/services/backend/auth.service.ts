import { Observable } from 'rxjs';
import { Credentials } from '../../types/models/Credentials';
import { Injectable, inject } from '@angular/core';
import { AUTH_REPOSITORY } from '../../types/tokens/AUTH_REPOSITORY';
import { IAuthBackend } from '../../types/contracts/IAuth';
import { Repository } from '../../types/contracts/repository.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements IAuthBackend {
  private repository = inject<Repository<object>>(AUTH_REPOSITORY);

  login = (
    cedentials: Credentials,
  ): Observable<{ data: { store: string; token: string }; success: boolean }> => {
    return this.repository.post<{ data: { store: string; token: string }; success: boolean }>(
      '',
      cedentials,
    );
  };
}
