import { inject, Injectable, WritableSignal } from '@angular/core';
import { MemStoreService } from '../../../services/ui/mem-store.service';
import { ToastService } from '../../../services/ui/toast.service';
import { ConnectionProfile } from '../../../types/models/ConnectionProfile';
import { TransferProfile } from '../../../types/models/TransferProfile';

@Injectable({
  providedIn: 'root',
})
export class TransferProfileService {
  private readonly localStore = inject(MemStoreService);
  private readonly toast = inject(ToastService);
  private readonly toastDuration: number = 1000;

  profiles: WritableSignal<ConnectionProfile[]> =
    this.localStore.signalOf<ConnectionProfile[]>('Profiles');
  transferProfiles: WritableSignal<TransferProfile[]> =
    this.localStore.signalOf<TransferProfile[]>('ConnectionProfiles');

  saveProfile(formData: TransferProfile) {
    const current = this.transferProfiles() ?? [];
    const updated = [...current, formData];
    this.transferProfiles.set(updated);
    this.localStore.updateValue('ConnectionProfiles', updated);
    this.showToast('Perfil almacenado');
  }

  setAsDefault(key: string) {
    const current = this.transferProfiles() ?? [];
    const updated = current.map((p) => ({ ...p, default: p.name === key }));
    this.transferProfiles.set(updated);
    this.localStore.updateValue('ConnectionProfiles', updated);
    this.showToast('Perfil seleccionado');

    const sourceDe = updated.find((x) => x.default);
    const credentials = this.localStore.getValue<ConnectionProfile[]>('Profiles');
    const source = credentials.find((x) => x.name === sourceDe.source);
    const target = credentials.find((x) => x.name === sourceDe.target);

    this.localStore.updateValue('Credentials_V6_Cloud', source.credential);
    this.localStore.updateValue('Credentials_V5_V5', target.credential);
  }

  removeProfile(key: string) {
    const current = this.transferProfiles() ?? [];
    const rest = current.filter((x) => x.name !== key);
    this.transferProfiles.set(rest);
    this.localStore.updateValue('ConnectionProfiles', rest);
    if (rest.length > 0) {
      this.setAsDefault(rest[0].name);
    }
    this.showToast('Perfil eliminado');
  }

  showToast = (message: string) => {
    this.toast.emitNotification({ message, duration: this.toastDuration });
  };
}
