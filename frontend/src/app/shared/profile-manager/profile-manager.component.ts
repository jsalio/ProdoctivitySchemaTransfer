import {
  // ChangeDetectionStrategy,
  Component,
  computed,
  // effect,
  OnInit,
  signal,
} from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { LocalDataService } from '../../services/ui/local-data.service';
import { Credentials } from '../../types/models/Credentials';
import { DataTableComponent, RecordRow } from '../data-table/data-table.component';

export interface Profiles {
  name: string;
  accountName: string;
  store: 'ProDoctivity 5' | 'ProDoctivity Cloud';
  organization: string;
  server: string;
  default: boolean;
}

@Component({
  selector: 'app-profile-manager',
  standalone: true,
  imports: [ButtonComponent, DataTableComponent],
  templateUrl: './profile-manager.component.html',
  styleUrl: './profile-manager.component.css',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileManagerComponent implements OnInit {
  profiles = signal<{ default: boolean; name: string; credential: Credentials }[]>([]);

  rows = computed(() => {
    const profilesData = this.profiles();
    console.log('Trigger');
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

  cols: RecordRow<Profiles>[] = [
    { field: 'default', label: '' },
    { field: 'store', label: 'Sistema' },
    { field: 'accountName', label: 'usuario' },
    { field: 'organization', label: 'Organizacion' },
    { field: 'server', label: 'Servidor' },
  ];
  /**
   *
   */
  constructor(private readonly appStore: LocalDataService) {}

  ngOnInit(): void {
    const profiles =
      this.appStore.getValue<{ default: boolean; name: string; credential: Credentials }[]>(
        'Profiles',
      );
    this.profiles.set(profiles);
  }

  removeRecord = (name: string) => {
    const current = this.profiles();
    // this.profiles.set([]);
    const target = current.find((x) => x.name == name);
    const records = current.filter((x) => x.name != name);

    // If the record doesn't exist, no-op except keep store in sync
    if (!target) {
      this.profiles.set(records);
      this.appStore.updateValue('Profiles', records);
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

    this.appStore.updateValue('Profiles', records);
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
    this.appStore.updateValue('Profiles', updated);

    if (target.credential.store === 'V5') {
      this.appStore.updateValue('Credentials_V5_V5', target.credential);
      return;
    }

    if (target.credential.store === 'Cloud') {
      this.appStore.updateValue('Credentials_V6_Cloud', target.credential);
      return;
    }
  };
}
