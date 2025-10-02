import { Component, computed, inject, WritableSignal } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { MemStoreService } from '../../services/ui/mem-store.service';
import { DataTableComponent } from '../data-table/data-table.component';
import { ProfileTableCols } from '../../types/models/constants';
import { Profiles } from '../../types/models/Profiles';
import { ConnectionProfile } from '../../types/models/ConnectionProfile';
import { ToastService } from '../../services/ui/toast.service';

@Component({
  selector: 'app-profile-manager',
  standalone: true,
  imports: [ButtonComponent, DataTableComponent],
  templateUrl: './profile-manager.component.html',
  styleUrl: './profile-manager.component.css',
})
export class ProfileManagerComponent {
  private mem = inject(MemStoreService);
  private toast = inject(ToastService);

  profiles: WritableSignal<ConnectionProfile[]>;

  rows = computed(() => {
    const profilesData = this.profiles();
    console.log('Trigger', profilesData);
    if (!profilesData) return [];
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

  cols = ProfileTableCols;

  /**
   *
   */
  constructor() {
    this.profiles = this.mem.signalOf<ConnectionProfile[]>('Profiles');
  }

  removeRecord = (name: string) => {
    const current = this.profiles();
    const target = current.find((x) => x.name == name);
    const records = current.filter((x) => x.name != name);

    // If the record doesn't exist, no-op except keep store in sync
    if (!target) {
      this.profiles.set(records);
      this.mem.updateValue('Profiles', records);
      return;
    }

    // Update profiles first
    this.profiles.set(records);

    // If we removed a default-eligible store, pick the next one of the same store
    if (target.credential.store === 'V5') {
      const next = records.find((x) => x.credential.store === 'V5');
      if (next) {
        this.setAsDefault(next.name);
      }
    }

    if (target.credential.store === 'Cloud') {
      const next = records.find((x) => x.credential.store === 'Cloud');
      if (next) {
        this.setAsDefault(next.name);
      }
    }

    this.mem.updateValue('Profiles', records);
    this.showNotification(`Perfil de borrado`);
  };

  setAsDefault = (name: string) => {
    const current = this.profiles();
    const target = current.find((x) => x.name == name);
    if (!target) {
      return;
    }

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

  showNotification = (message: string) => {
    this.toast.emitNotification({ message: message, duration: 2000 });
  };
}
