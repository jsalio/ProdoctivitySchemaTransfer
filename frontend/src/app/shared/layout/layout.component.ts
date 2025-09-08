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
  showToastFlag = signal<boolean>(false);
  toastmessage = signal<string>(''); //('¡Esto es un mensaje de prueba!');
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
    // console.log('Conectado is ready:', this.connectionStatusService.connectedToCloud());
  }

  openCredentialsModal = () => {
    this.isCredentialOpen = true;
  };

  closeCredentialsModal = () => {
    this.isCredentialOpen = false;
  };

  getConnectionStatus = () => {
    return this.connectionStatus();

    // const credentialsCloud = this.storage.getValue<Credentials>("Credentials_V6_Cloud")
    // const credentialsFluency = this.storage.getValue<Credentials>("Credentials_V5_V5")

    // if (!credentialsCloud && !credentialsFluency){
    //   return "Desconectado"
    // }

    // if (credentialsCloud){
    //   const tokenInvalid = isTokenExpired(credentialsCloud.token)
    //   if (tokenInvalid){
    //     return 'Desconectado'
    //   }
    //   return 'Conectado'
    // }

    // return 'Desconectado'
  };

  showToast = () => {
    this.showToastFlag.set(true);
    setTimeout(() => {
      this.showToastFlag.set(false);
    }, 3300);
  };
}
