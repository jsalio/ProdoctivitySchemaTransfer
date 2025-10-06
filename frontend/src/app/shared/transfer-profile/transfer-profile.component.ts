import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { DataTableComponent } from '../data-table/data-table.component';
import { TransferConnectionProfiles } from '../../types/models/constants';
import { ModalComponent } from '../modal/modal.component';
import { ButtonComponent } from '../button/button.component';
import { MemStoreService } from '../../services/ui/mem-store.service';
import { ConnectionProfile } from '../../types/models/ConnectionProfile';
import { TransferProfile } from '../../types/models/TransferProfile';
import { ToastService } from '../../services/ui/toast.service';

@Component({
  selector: 'app-transfer-profile',
  standalone: true,
  imports: [DataTableComponent, ModalComponent, ButtonComponent],
  templateUrl: './transfer-profile.component.html',
  styleUrl: './transfer-profile.component.css',
})
export class TransferProfileComponent {
  cols = TransferConnectionProfiles;

  private readonly localStore = inject(MemStoreService);
  private readonly toast = inject(ToastService);

  profiles: WritableSignal<ConnectionProfile[]>;
  transferProfile: WritableSignal<TransferProfile[]>;

  source = signal<ConnectionProfile | undefined>(undefined);
  target = signal<ConnectionProfile | undefined>(undefined);
  name = signal<string>('');

  optionsSource = computed(() => {
    const credentials = this.profiles();
    if (!credentials || credentials.length === 0) {
      return undefined;
    }
    return credentials
      .filter((x) => x.credential.store === 'Cloud')
      .map((x) => ({
        label: x.name,
        value: x,
      }));
  });

  optionsTarget = computed(() => {
    const credentials = this.profiles();
    if (!credentials || credentials.length === 0) {
      return undefined;
    }
    return credentials
      .filter((x) => x.credential.store !== 'Cloud')
      .map((x) => ({
        label: x.name,
        value: x,
      }));
  });

  sourceLabel = computed(() => {
    if (!this.source()) {
      return '';
    }

    return `Server: ${this.source().credential.serverInformation.server} - Orgnanizacion: ${this.source().credential.serverInformation.organization} - Usuario : ${this.source().credential.username}`;
  });

  targetLabel = computed(() => {
    if (!this.target()) {
      return '';
    }

    return `Server: ${this.target().credential.serverInformation.server} - Usuario: ${this.target().credential.username}`;
  });

  dataSet = computed(() => {
    const X = this.localStore.getValue('Credentials_V6_Cloud');
    console.log(X);
    const transferProfile = this.transferProfile();
    if (!transferProfile) {
      return [];
    }
    return transferProfile.map(
      (x): TransferProfile => ({
        default: x.default,
        name: x.name,
        source: x.source,
        target: x.target,
        serverSource: x.serverSource,
        serverTarget: x.serverTarget,
      }),
    );
  });

  /**
   *
   */
  constructor() {
    this.profiles = this.localStore.signalOf<ConnectionProfile[]>('Profiles');
    this.transferProfile = this.localStore.signalOf<TransferProfile[]>('ConnectionProfiles');
  }

  modalIsOpen = signal<boolean>(false);

  closeModal = () => {
    this.modalIsOpen.set(!this.modalIsOpen());
  };

  openAddModal = () => {
    this.modalIsOpen.set(!this.modalIsOpen());
  };

  onTargetChange = (event: Event) => {
    const selectElement = event.target as HTMLSelectElement;
    const cred = this.profiles().find((x) => x.name === selectElement.value);
    this.target.set(cred);
  };

  onSourceChange = (event: Event) => {
    const selectElement = event.target as HTMLSelectElement;
    const cred = this.profiles().find((x) => x.name === selectElement.value);
    this.source.set(cred);
  };

  save = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();

    const formData: TransferProfile = {
      default: false,
      name: this.name(),
      source: this.source().name,
      target: this.target().name,
      serverSource: this.sourceLabel(),
      serverTarget: this.targetLabel(),
    };

    const current = this.transferProfile() ?? [];
    const updated = [...current, formData];
    this.transferProfile.set(updated);
    this.localStore.updateValue('ConnectionProfiles', updated);
    this.modalIsOpen.set(false);
    this.toast.emitNotification({ message: 'Perfil almacenado', duration: 2000 });
  };

  handleInput = (event: Event) => {
    this.name.set((event.target as HTMLInputElement).value);
  };

  setAsDefault = (key: string) => {
    const current = this.transferProfile() ?? [];
    const updated = current.map((p) => ({ ...p, default: p.name === key }));
    this.transferProfile.set(updated);
    this.localStore.updateValue('ConnectionProfiles', updated);
    this.toast.emitNotification({ message: 'Perfil seleccionado ', duration: 2000 });

    const sourceDe = updated.find((x) => x.default);
    const credentials = this.localStore.getValue<ConnectionProfile[]>('Profiles');
    const source = credentials.find((x) => x.name === sourceDe.source);
    const target = credentials.find((x) => x.name === sourceDe.target);

    this.localStore.updateValue('Credentials_V6_Cloud', source.credential);
    this.localStore.updateValue('Credentials_V5_V5', target.credential);
  };

  removeRecord = (key: string) => {
    const current = this.transferProfile() ?? [];
    const rest = current.filter((x) => x.name !== key);
    this.transferProfile.set(rest);
    this.localStore.updateValue('ConnectionProfiles', rest);
    if (rest.length > 0) {
      this.setAsDefault(rest[0].name);
    }
    this.toast.emitNotification({ message: 'Perfil eliminado ', duration: 2000 });
  };
}
