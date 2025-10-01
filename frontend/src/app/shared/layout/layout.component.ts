import { Component, computed, OnInit, signal, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
// import { ConnectionStatusService } from '../../services/ui/connection-status.service';
import { LayoutService } from '../../services/ui/layout.service';
import { CredentialsComponent } from '../credentials/credentials.component';
import { ModalComponent } from '../modal/modal.component';
import { CredetialConnectionService } from '../../services/ui/credetial-connection.service';
import { ToatsComponent } from '../toats/toats.component';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/ui/toast.service';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { ButtonComponent } from '../button/button.component';
import { SelectOption } from '../select/select.component';
import { Credentials } from '../../types/models/Credentials';
import { LocalDataService } from '../../services/ui/local-data.service';
import { ProfileManagerComponent } from '../profile-manager/profile-manager.component';
// import { DataTableComponent, RecordRow } from '../data-table/data-table.component';

// export interface Row {
//   name: string;
//   title: string;
//   status: string;
//   role: string;
// }

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    ModalComponent,
    CredentialsComponent,
    RouterLink,
    ToatsComponent,
    CommonModule,
    DropdownComponent,
    ButtonComponent,
    ProfileManagerComponent,
    // DataTableComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  // //
  // rows: Row[] = [
  //   { name: 'John Doe', title: 'Software Engineer', status: 'Active', role: 'Member' },
  //   { name: 'Jane Smith', title: 'UI/UX Designer', status: 'Active', role: 'Member' },
  //   { name: 'Carlos Pérez', title: 'Project Manager', status: 'Inactive', role: 'Admin' },
  // ];

  // cols: RecordRow<Row>[] = [
  //   { field: 'name', label: 'Name' },
  //   { field: 'title', label: 'Title' },
  //   { field: 'status', label: 'Status' },
  //   { field: 'role', label: 'Role' },
  // ];
  // //

  private readonly connectionStatusService = inject(CredetialConnectionService);
  private readonly layoutService = inject(LayoutService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  isCredentialOpen = false;
  toastmessage = signal<string>('');
  showToastFlag = signal<boolean>(false);
  modalOpen = signal<boolean>(false);
  modalForChangeTransferLine = signal<boolean>(false);
  configuration = signal<'Cloud' | 'Fluency' | ''>('');
  transferLine = signal<'CloudToFluency' | 'FlencyToCloud' | ''>('CloudToFluency');
  profileModalIsOpen = signal<boolean>(true);
  profileCredentials = signal<Credentials | null>(null);

  /**
   *
   */
  constructor(private readonly appStore: LocalDataService) {
    // super();
  }

  connectionStatus = computed(() => {
    if (!this.connectionStatusService.connectedToCloud()) {
      console.log('Navegando');
      this.router.navigate(['connection-fail']);
    }
    return this.connectionStatusService.connectedToCloud() ? 'Conectado' : 'Desconectado';
  });

  ngOnInit(): void {
    this.layoutService.onLayoutEmit().subscribe(() => {
      this.isCredentialOpen = true;
    });
    this.toastService.onNotify().subscribe((data) => {
      this.toastmessage.set(data.message);
      this.showToastFlag.set(true);

      setTimeout(() => {
        this.showToastFlag.set(false);
        this.toastmessage.set('');
      }, 3300);
    });
    this.layoutService.modalLayoutEmit().subscribe((server) => {
      this.modalOpen.set(true);
      this.configuration.set(server);
    });
    this.layoutService.modalTransferLineEmit().subscribe(() => {
      this.modalForChangeTransferLine.set(true);
    });
    this.layoutService.modalProfileListEmit().subscribe(() => {
      this.profileModalIsOpen.set(true);
    });
  }

  openCredentialsModal = () => {
    this.isCredentialOpen = true;
  };

  closeCredentialsModal = () => {
    this.isCredentialOpen = false;
  };

  getConnectionStatus = () => {
    return this.connectionStatus();
  };

  showToast = () => {
    this.showToastFlag.set(true);
    setTimeout(() => {
      this.showToastFlag.set(false);
    }, 3300);
  };

  closeModal = () => {
    this.modalOpen.set(false);
  };

  closeTransferModal = () => {
    this.modalForChangeTransferLine.set(false);
  };

  getTextFromTransferLine = () => {
    return this.transferLine() === 'CloudToFluency' ? '' : '';
  };

  selectOptions = signal<SelectOption[]>([
    { value: 1, label: 'Opción 1' },
    { value: 2, label: 'Opción 2' },
    { value: 3, label: 'Opción 3', disabled: true },
    { value: 4, label: 'Opción 4' },
  ]);

  selectedValue = signal<string | number>('');

  onValueChange(value: string | number): void {
    this.selectedValue.set(value);
    console.log('Nuevo valor seleccionado:', value);
  }

  closeProfileModal = () => {
    this.profileModalIsOpen.set(false);
  };

  recieveData = (data: Credentials) => {
    this.profileCredentials.set(data);
    console.log(data);
  };

  saveProfile = () => {
    const profile = this.profileCredentials();
    if (!profile || !profile.username || !profile.store) {
      throw new Error('Invalid profile data');
    }
    if (profile.store === 'Cloud' && !profile.serverInformation?.organization) {
      throw new Error('Missing organization for Cloud profile');
    }

    const key = 'Profiles';
    const profiles = this.appStore.getValue<{ name: string; credential: Credentials }[]>(key) || [];
    const profileStoreName =
      profile.store !== 'Cloud'
        ? `${profile.username}-${profile.store}-${profile.serverInformation.server}`
        : `${profile.username}-${profile.store}-${profile.serverInformation.organization}`;

    const index = profiles.findIndex((x) => x.name === profileStoreName);
    if (index !== -1) {
      profiles.splice(index, 1, { name: profileStoreName, credential: profile });
    } else {
      profiles.push({ name: profileStoreName, credential: profile });
    }

    this.appStore.updateValue(key, profiles);
    this.profileCredentials.set(null);
  };
}
