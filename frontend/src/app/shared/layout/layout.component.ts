import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
// import { ConnectionStatusService } from '../../services/ui/connection-status.service';
import { LayoutService } from '../../services/ui/layout.service';
import { LocalDataService } from '../../services/ui/local-data.service';
import { CredentialsComponent } from '../credentials/credentials.component';
import { ModalComponent } from '../modal/modal.component';
import { CredetialConnectionService } from '../../services/ui/credetial-connection.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, ModalComponent, CredentialsComponent, RouterLink],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  isCredentialOpen: boolean = false;
  connectionStatus = computed(() => {
    if (!this.connectionStatusService.connectedToCloud()) {
      console.log('Navegando');
      this.router.navigate(['connection-fail']);
    }
    return this.connectionStatusService.connectedToCloud() ? 'Conectado' : 'Desconectado';
  });

  /**
   *
   */
  constructor(
    private readonly connectionStatusService: CredetialConnectionService,
    private readonly layoutService: LayoutService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.layoutService.onLayoutEmit().subscribe(() => {
      this.isCredentialOpen = true;
    });
    console.log('Conectado is ready:', this.connectionStatusService.connectedToCloud());
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
}
