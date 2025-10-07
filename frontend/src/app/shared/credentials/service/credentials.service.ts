import { inject, Injectable } from '@angular/core';
import { AuthService } from '../../../services/backend/auth.service';
import { MemStoreService } from '../../../services/ui/mem-store.service';
import { CredetialConnectionService } from '../../../services/ui/credetial-connection.service';
import { ToastService, defaultTimeDisplay } from '../../../services/ui/toast.service';
import { StorageKey } from '../../../types/models/StorageKey';
import { Credentials } from '../credentials.component';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CredentialsService {
  private readonly auth = inject(AuthService);
  private readonly store = inject(MemStoreService);
  private readonly connectionStatus = inject(CredetialConnectionService);
  private readonly toast = inject(ToastService);

  computeKey(storeName: 'V5' | 'Cloud'): StorageKey {
    const version = storeName === 'Cloud' ? 'V6' : 'V5';
    return `Credentials_${version}_${storeName}` as StorageKey;
  }

  login(
    credentials: Credentials,
  ): Observable<{ data: { store: string; token: string }; success: boolean }> {
    return this.auth.login(credentials);
  }

  persistCredentials(key: StorageKey, storeName: 'V5' | 'Cloud', credentials: Credentials): void {
    if (key === 'Credentials_V6_Cloud' || storeName === 'Cloud') {
      // For cloud we also notify connection service
      this.connectionStatus.updateCredentials(credentials);
    } else {
      this.store.storeValue(key, credentials);
    }
  }

  showToast(message: string): void {
    this.toast.emitNotification({ message, duration: defaultTimeDisplay });
  }
}
