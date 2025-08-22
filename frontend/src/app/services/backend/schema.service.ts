import { DocumentGroup, ISchema } from '../../types/contracts/ISchema';

import { BaseService } from './BaseService';
import { Credentials } from '../../types/models/Credentials';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SchemaService extends BaseService implements ISchema {

  constructor(private readonly client:HttpClient) 
  {
    super(client, "schema");
  }

  getDocumentGruops (credetials: Credentials): Observable<{data: Array<DocumentGroup>, success:boolean}>{
    return this.client.post<{data: Array<DocumentGroup>, success:boolean}>(this.Uri, credetials)
  }

  getDocumentTypesInGroup (credentials: Credentials, groupId: string): Observable<{ data: Array<any>; success: boolean; }>{
    return this.client.post<{data: Array<any>, success:boolean}>(`${this.Uri}/group/${groupId}`, credentials)
  }

  getDocumentTypeSchema (credentials: Credentials, documentTypeId: string): Observable<{ data: any; success: boolean; }>{
    return this.client.post<{data: any, success:boolean}>(`${this.Uri}/document-type/${documentTypeId}`, credentials)
  }

  getAllDataElements (credetials: Credentials): Observable<{ data: Array<any>; success: boolean; }>{
    return this.client.post<{data: Array<DocumentGroup>, success:boolean}>(`${this.Uri}/data-elements`, credetials)
  }
}
