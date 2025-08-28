import { DocumentGroup, ISchema, Response } from '../../types/contracts/ISchema';

import { BaseService } from './BaseService';
import { Credentials } from '../../types/models/Credentials';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataElement, DocumentType } from '../../types/models/SchemaDocumentType';

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

  saveNewDocumentGroup(credentials: Credentials, groupStruct: { name: string; }) : Observable<Response<DocumentGroup>> {
    const body = {
      credentials,
      name: groupStruct.name
    }
    return this.client.post<Response<DocumentGroup>>(`${this.Uri}/create-document-group`, body)
  }

  saveNewDocumentType(credentials: Credentials, documentTypeStruct: { name: string; documentGroupId: string; }) : Observable<Response<DocumentType>> {
    const body = {
      credentials,
      createDocumentTypeRequest: {
        name: documentTypeStruct.name,
        documentGroupId: documentTypeStruct.documentGroupId
      }
    }
    return this.client.post<Response<DocumentType>>(`${this.Uri}/create-document-type`, body)
  }

  saveNewKeyword(credentials: Credentials, keywordStruct: { name: string; dataType: string; require: string; }) : Observable<Response<DataElement>> {
    const body = {
      credentials,
      createDataElementRequest: {
        name: keywordStruct.name,
        dataType: keywordStruct.dataType,
        isRequired: keywordStruct.require,
      }
    }
    return this.client.post<Response<DataElement>>(`${this.Uri}/create-data-element`, body) 
  }
  saveNewDocumentSchema(credentials: Credentials, documentSchemaStruct: { name: string; documentTypeId: string; keywordId: string; }) : Observable<any> {
    const body = {
      credentials,
      assignDataElementToDocumentRequest: {
        documentTypeId: documentSchemaStruct.documentTypeId,
        dataElement: {
          name:documentSchemaStruct.name,
          order: 0
        }
      }
    }
    debugger
    return this.client.post<any>(`${this.Uri}/assign-data-element`, body)
  }

  // saveNewDocumentSchema(credentials: Credentials, documentSchemaStruct: { documentTypeId: string; keywordId: number; }) : Observable<any> {
  //   const body = {
  //     credentials,
  //     assignDataElementRequest: {
  //       documentTypeId: documentSchemaStruct.documentTypeId,
  //       dataElement: documentSchemaStruct.keywordId
  //     }
  //   }
  //   debugger
  //   return this.client.post<any>(`${this.Uri}/assign-data-element`, body)
  // }
}
