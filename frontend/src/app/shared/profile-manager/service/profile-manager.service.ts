import { inject, Injectable, WritableSignal, computed } from '@angular/core';
import { MemStoreService } from '../../../services/ui/mem-store.service';
import { ToastService } from '../../../services/ui/toast.service';
import { ConnectionProfile } from '../../../types/models/ConnectionProfile';
import { Profiles } from '../../../types/models/Profiles';

@Injectable({ providedIn: 'root' })
export class ProfileManagerService {
  private readonly mem = inject(MemStoreService);
  private readonly toast = inject(ToastService);
  private readonly toastDuration = 2000;

  profiles: WritableSignal<ConnectionProfile[]> =
    this.mem.signalOf<ConnectionProfile[]>('Profiles');

  // Expose rows mapping so components can bind directly without duplicating logic
  rows = computed<Profiles[]>(() => {
    const profilesData = this.profiles();
    if (!profilesData || profilesData.length === 0) return [];
    return profilesData.map(
      (x): Profiles => ({
        name: x.name,
        default: x.default,
        accountName: x.credential.username,
        server: x.credential.serverInformation.server,
        organization:
          x.credential.serverInformation.organization === ''
            ? 'Por defecto'
            : x.credential.serverInformation.organization,
        store: x.credential.store === 'V5' ? 'ProDoctivity 5' : 'ProDoctivity Cloud',
      }),
    );
  });

  setAsDefault = (name: string) => {
    const current = this.profiles() ?? [];
    const target = current.find((x) => x.name === name);
    if (!target) return;

    // Flip default for the target store only, and clear others of the same store
    const updated = current.map((p) =>
      p.credential.store === target.credential.store ? { ...p, default: p.name === name } : p,
    );

    this.profiles.set(updated);
    this.mem.updateValue('Profiles', updated);

    if (target.credential.store === 'V5') {
      this.mem.updateValue('Credentials_V5_V5', target.credential);
      this.showNotification('Perfil por defecto de V5 establecido');
      return;
    }

    if (target.credential.store === 'Cloud') {
      this.mem.updateValue('Credentials_V6_Cloud', target.credential);
      this.showNotification('Perfil por defecto de Cloud establecido');
      return;
    }
  };

  removeProfile = (name: string) => {
    const current = this.profiles() ?? [];
    const target = current.find((x) => x.name === name);
    const records = current.filter((x) => x.name !== name);

    // Keep store in sync even if target not found
    if (!target) {
      this.profiles.set(records);
      this.mem.updateValue('Profiles', records);
      return;
    }

    // Update profiles first
    this.profiles.set(records);

    // If we removed a profile, re-select the next available of the same store as default
    if (target.credential.store === 'V5') {
      const next = records.find((x) => x.credential.store === 'V5');
      if (next) this.setAsDefault(next.name);
    }

    if (target.credential.store === 'Cloud') {
      const next = records.find((x) => x.credential.store === 'Cloud');
      if (next) this.setAsDefault(next.name);
    }

    this.mem.updateValue('Profiles', records);
    this.showNotification('Perfil de borrado');
  };

  showNotification = (message: string) => {
    this.toast.emitNotification({ message, duration: this.toastDuration });
  };
}
