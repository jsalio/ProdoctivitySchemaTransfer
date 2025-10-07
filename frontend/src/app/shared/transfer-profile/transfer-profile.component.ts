import { Component, computed, inject, signal } from '@angular/core';
import { DataTableComponent } from '../data-table/data-table.component';
import { TransferConnectionProfiles } from '../../types/models/constants';
import { ModalComponent } from '../modal/modal.component';
import { ButtonComponent } from '../button/button.component';
import { ConnectionProfile } from '../../types/models/ConnectionProfile';
import { TransferProfile } from '../../types/models/TransferProfile';
import { ProfileFilterStrategy } from './strategies/ProfileFilterStrategy';
import { TransferProfileService } from './service/transfer-profile.service';
import { CloudProfileFilterStrategy } from './strategies/CloudProfileFilterStrategy';
import { LabelFormatterStrategy } from './strategies/LabelFormatterStrategy';
import { NonCloudProfileFilterStrategy } from './strategies/NonCloudProfileFilterStrategy';
import { SourceLabelFormatter } from './strategies/SourceLabelFormatter';
import { TargetLabelFormatter } from './strategies/TargetLabelFormatter';

@Component({
  selector: 'app-transfer-profile',
  standalone: true,
  imports: [DataTableComponent, ModalComponent, ButtonComponent],
  templateUrl: './transfer-profile.component.html',
  styleUrl: './transfer-profile.component.css',
})
export class TransferProfileComponent {
  cols = TransferConnectionProfiles;

  private readonly service = inject(TransferProfileService);
  private readonly sourceFilter: ProfileFilterStrategy = new CloudProfileFilterStrategy();
  private readonly targetFilter: ProfileFilterStrategy = new NonCloudProfileFilterStrategy();
  private readonly sourceFormatter: LabelFormatterStrategy = new SourceLabelFormatter();
  private readonly targetFormatter: LabelFormatterStrategy = new TargetLabelFormatter();

  source = signal<ConnectionProfile | undefined>(undefined);
  target = signal<ConnectionProfile | undefined>(undefined);
  name = signal<string>('');
  modalIsOpen = signal<boolean>(false);

  optionsSource = computed(() => {
    const credentials = this.service.profiles();
    if (!credentials || credentials.length === 0) {
      return undefined;
    }
    return this.sourceFilter.filter(credentials);
  });

  optionsTarget = computed(() => {
    const credentials = this.service.profiles();
    if (!credentials || credentials.length === 0) {
      return undefined;
    }
    return this.targetFilter.filter(credentials);
  });

  sourceLabel = computed(() => this.sourceFormatter.format(this.source()));
  targetLabel = computed(() => this.targetFormatter.format(this.target()));

  dataSet = computed(() => {
    const transferProfile = this.service.transferProfiles();
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

  closeModal = () => {
    this.modalIsOpen.set(!this.modalIsOpen());
  };

  openAddModal = () => {
    this.modalIsOpen.set(!this.modalIsOpen());
  };

  onTargetChange = (event: Event) => {
    const selectElement = event.target as HTMLSelectElement;
    const cred = this.service.profiles().find((x) => x.name === selectElement.value);
    this.target.set(cred);
  };

  onSourceChange = (event: Event) => {
    const selectElement = event.target as HTMLSelectElement;
    const cred = this.service.profiles().find((x) => x.name === selectElement.value);
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

    this.service.saveProfile(formData);
    this.modalIsOpen.set(false);
    this.name.set('');
    this.source.set(undefined);
    this.target.set(undefined);
  };

  handleInput = (event: Event) => {
    this.name.set((event.target as HTMLInputElement).value);
  };

  setAsDefault = (key: string) => {
    this.service.setAsDefault(key);
  };

  removeRecord = (key: string) => {
    this.service.removeProfile(key);
  };
}
