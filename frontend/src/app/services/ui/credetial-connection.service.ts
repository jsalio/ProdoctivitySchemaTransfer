import { inject, Injectable, signal } from '@angular/core';
import { LocalDataService } from './local-data.service';
import { Credentials } from '../../types/models/Credentials';
import { isTokenExpired } from '../../shared/utils/token-decoder';

@Injectable({
  providedIn: 'root',
})
export class CredetialConnectionService {
  private storage = inject(LocalDataService);
  private IsValidCredentials = (): boolean => {
    const credentialsCloud = this.storage.getValue<Credentials>('Credentials_V6_Cloud');
    console.log(credentialsCloud);
    if (!credentialsCloud) {
      console.log('Invalido');
      return false;
    }
    const tokenInvalid = isTokenExpired(credentialsCloud.token);

    if (isTokenExpired === null || !isTokenExpired) {
      console.log('Invalido');
      return false;
    }
    return tokenInvalid ? false : true;
  };

  public connectedToCloud = signal<boolean>(this.IsValidCredentials());

  // constructor(private readonly storage: LocalDataService) {}

  // Método para actualizar credenciales y signal
  updateCredentials(newCredentials: Credentials): void {
    // Guardar las nuevas credenciales en LocalDataService
    this.storage.storeValue('Credentials_V6_Cloud', newCredentials);
    // Actualizar el signal con la nueva validación
    this.connectedToCloud.set(this.IsValidCredentials());
  }

  // Método para forzar la validación manual (opcional, por si necesitas refrescar sin cambiar credenciales)
  refreshConnectionState(): void {
    this.connectedToCloud.set(this.IsValidCredentials());
  }
}
