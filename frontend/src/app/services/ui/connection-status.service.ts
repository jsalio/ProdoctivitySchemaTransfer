import { computed, effect, Injectable } from '@angular/core';
import { isTokenExpired } from '../../shared/utils/token-decoder';
import { Credentials } from '../../types/models/Credentials';
import { LocalDataService } from './local-data.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectionStatusService {

  private credentialsCloud = computed(() => this.storage.getValue<Credentials>("Credentials_V6_Cloud"))
  private credentialsFluency = computed(() => this.storage.getValue<Credentials>("Credentials_V5_V5"))


  status = new BehaviorSubject<'Conectado' | 'Desconectado'>('Desconectado')

  constructor(private readonly storage: LocalDataService) {
    // this.status.next(this.getStatus())
    effect(() => {
      const s = () => {
        const credentialsCloud = this.credentialsCloud()
        const credentialsFluency = this.credentialsFluency()

        if (!credentialsCloud && !credentialsFluency) {
          return "Desconectado"
        }

        if (credentialsCloud) {
          const tokenInvalid = isTokenExpired(credentialsCloud.token)
          if (tokenInvalid) {
            return 'Desconectado'
          }
          return 'Conectado'
        }

        return 'Desconectado'
      }
      this.status.next(s())
    })
  }


  getStatus$(): Observable<'Conectado' | 'Desconectado'> {
    return this.status.asObservable()
  }
}
