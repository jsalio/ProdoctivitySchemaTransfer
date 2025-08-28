import {Component, input} from '@angular/core';

import { Credentials } from '../../types/models/Credentials';
import { CredentialsComponent } from "../credentials/credentials.component";
import { LocalDataService } from '../../services/ui/local-data.service';
import { ModalComponent } from "../modal/modal.component";
import { RouterLink, RouterOutlet } from '@angular/router';
import { isTokenExpired } from '../utils/token-decoder';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, ModalComponent, CredentialsComponent, RouterLink],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  isCredentialOpen:boolean = false;

 /**
  *
  */
 constructor(private readonly storage: LocalDataService) {
  // super();
  
 }

  openCredentialsModal = () => {
    this.isCredentialOpen = true
  }

  closeCredentialsModal = () => {
    this.isCredentialOpen = false
  }


  getConnectionStatus = () => {
    
    const credentialsCloud = this.storage.getValue<Credentials>("Credentials_V6_Cloud")
    const credentialsFluency = this.storage.getValue<Credentials>("Credentials_V5_V5")
    
    if (!credentialsCloud && !credentialsFluency){
      return "Desconectado"
    } 

    if (credentialsCloud){
      const tokenInvalid = isTokenExpired(credentialsCloud.token)
      if (tokenInvalid){
        return 'Desconectado'
      }
      return 'Conectado'
    }

    return 'Desconectado'


  }
}
