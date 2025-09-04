import { Component, effect, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ConnectionStatusService } from '../../services/ui/connection-status.service';
import { LayoutService } from '../../services/ui/layout.service';
import { LocalDataService } from '../../services/ui/local-data.service';
import { CredentialsComponent } from '../credentials/credentials.component';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, ModalComponent, CredentialsComponent, RouterLink],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  isCredentialOpen: boolean = false;
  connectionStatus = signal<'Conectado' | 'Desconectado'>('Desconectado');

  /**
   *
   */
  constructor(
    private readonly storage: LocalDataService,
    private readonly connectionStatusService: ConnectionStatusService,
    private readonly layoutService: LayoutService,
    private readonly router: Router,
  ) {
    // super();
    effect(
      () => {
        this.connectionStatusService.getStatus$().subscribe((status) => {
          if (status === 'Desconectado') {
            this.router.navigate(['connection-fail']);
          } else {
            this.router.navigate(['schema-transfer']);
          }
          this.connectionStatus.set(status);
        });
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    this.layoutService.onLayoutEmit().subscribe(() => {
      this.isCredentialOpen = true;
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
