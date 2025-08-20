import { Observable, Subscription } from 'rxjs';

import { BaseService } from './BaseService';
import { Credentials } from '../../types/models/Credentials'
import { HttpClient } from '@angular/common/http';
import { IAuthBackend } from '../../types/contracts/IAuth';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService implements IAuthBackend {

  constructor(private readonly client: HttpClient) {
    super(client, 'auth')
  }

  login(credentials: Credentials):Observable<{data:{store:string,token:string},success:boolean}> {
    return this.client.post<{data:{store:string,token:string},success:boolean}>(`http://localhost:3000/auth`, credentials)
  }
}
