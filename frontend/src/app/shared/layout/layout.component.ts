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
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
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
}
