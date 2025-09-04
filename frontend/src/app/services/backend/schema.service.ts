import { DocumentGroup, ISchema, Response } from '../../types/contracts/ISchema';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SCHEMA_REPOSITORY } from '../../providers';
import { Repository } from '../../types/contracts/repository.interface';
import { Credentials } from '../../types/models/Credentials';
import { DataElement, DocumentType } from '../../types/models/SchemaDocumentType';

@Injectable({
  providedIn: 'root',
})
export class SchemaService implements ISchema {
  constructor(@Inject(SCHEMA_REPOSITORY) private repository: Repository<any>) {}

  getDocumentGruops(
    credentials: Credentials,
  ): Observable<{ data: Array<DocumentGroup>; success: boolean }> {
    return this.repository.post<{ data: Array<DocumentGroup>; success: boolean }>('', credentials);
  }

  getDocumentTypesInGroup(
    credentials: Credentials,
    groupId: string,
  ): Observable<{ data: Array<DocumentType>; success: boolean }> {
    return this.repository.post<{ data: Array<DocumentType>; success: boolean }>(
      `group/${groupId}`,
      credentials,
    );
  }

  getDocumentTypeSchema(
    credentials: Credentials,
    documentTypeId: string,
  ): Observable<{ data: any; success: boolean }> {
    return this.repository.post<{ data: any; success: boolean }>(
      `document-type/${documentTypeId}`,
      credentials,
    );
  }

  getAllDataElements(
    credentials: Credentials,
  ): Observable<{ data: Array<DataElement>; success: boolean }> {
    return this.repository.post<{ data: Array<DataElement>; success: boolean }>(
      'data-elements',
      credentials,
    );
  }

  saveNewDocumentGroup(
    credentials: Credentials,
    groupStruct: { name: string },
  ): Observable<Response<DocumentGroup>> {
    const body = {
      credentials,
      name: groupStruct.name,
    };
    return this.repository.post<Response<DocumentGroup>>('create-document-group', body);
  }

  saveNewDocumentType(
    credentials: Credentials,
    documentTypeStruct: { name: string; documentGroupId: string },
  ): Observable<Response<DocumentType>> {
    const body = {
      credentials,
      createDocumentTypeRequest: {
        name: documentTypeStruct.name,
        documentGroupId: documentTypeStruct.documentGroupId,
      },
    };
    return this.repository.post<Response<DocumentType>>('create-document-type', body);
  }

  saveNewKeyword(
    credentials: Credentials,
    keywordStruct: { name: string; dataType: string; require: string; label: string },
  ): Observable<Response<DataElement>> {
    const body = {
      credentials,
      createDataElementRequest: {
        name: keywordStruct.name,
        dataType: keywordStruct.dataType,
        isRequired: keywordStruct.require,
        label: keywordStruct.label,
      },
    };
    return this.repository.post<Response<DataElement>>('create-data-element', body);
  }

  saveNewDocumentSchema(
    credentials: Credentials,
    documentSchemaStruct: { name: string; documentTypeId: string; keywordId: string },
  ): Observable<Response<any>> {
    const body = {
      credentials,
      assignDataElementToDocumentRequest: {
        documentTypeId: documentSchemaStruct.documentTypeId,
        dataElement: {
          name: documentSchemaStruct.name,
          order: 0,
          id: documentSchemaStruct.keywordId,
        },
      },
    };
    return this.repository.post<Response<any>>('assign-data-element', body);
  }
}
