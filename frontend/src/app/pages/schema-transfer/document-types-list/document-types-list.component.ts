import { ChangeDetectionStrategy, Component, OnChanges, SimpleChanges, computed, input, output, signal } from '@angular/core';

import { Credentials } from '../../../types/models/Credentials';
import { LocalDataService } from '../../../services/ui/local-data.service';
import { ObservableHandler } from '../../../shared/utils/Obserbable-handler';
import { SchemaService } from '../../../services/backend/schema.service';

export interface DocumentType {
  documentTypeId: string,
  documentTypeName: string,
}

export type SchemaDocumentType = {
  documentTypeId: string,
  documentTypeName: string,
  targetDocumentTYpe: string
}

@Component({
  selector: 'app-document-types-list',
  standalone: true,
  imports: [],
  templateUrl: './document-types-list.component.html',
  styleUrl: './document-types-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentTypesListComponent implements OnChanges {
  parentGroup = input<string>("")
  parentTargetGroup= input<string>("")

  documentTypes = signal<DocumentType[]>([])
  documentTypesSchemas = computed(() => {

    const findInTarget = (name: string): string => {
      const target = this.targetDocumentTypes().find(x => x.documentTypeName === name)
      if (!target) {
        return ""
      }
      console.log('Existe', target.documentTypeName)
      return target.documentTypeId
    }

    return this.documentTypes().map(x => ({
      documentTypeId:x.documentTypeId,
      documentTypeName:x.documentTypeName,
      targetDocumentTYpe: findInTarget(x.documentTypeName)
    } as SchemaDocumentType))
  })

  targetDocumentTypes = signal<DocumentType[]>([])
  loading = signal<boolean>(false)
  docList = signal<{ checked: boolean, docId: string }[]>([])
  onDocumentypeSeleted = output<SchemaDocumentType>()
  /**
   *
   */
  constructor(private readonly localData: LocalDataService, private readonly schemaService: SchemaService) {

  }



  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.parentGroup())
    const credentialOfcloud = this.localData.getValue<Credentials>("Credentials_V6_Cloud");
    if (credentialOfcloud && this.parentGroup() != null) {
      this.loading.set(true)
      this.documentTypes.set([])
      ObservableHandler.handle(this.schemaService.getDocumentTypesInGroup(credentialOfcloud, this.parentGroup()))
        .onStart(() => this.loading.set(true))
        .onFinalize(() => this.loading.set(false))
        .onError((error) => {
          console.log(error)
        })
        .onNext((resolve) => {
          this.documentTypes.set(resolve.data)
          this.loading.set(false)
          this.docList.set(this.documentTypes().map(x => ({ checked: false, docId: x.documentTypeId })))
        })
        .execute()
    }
    const credentialsOfFluency = this.localData.getValue<Credentials>("Credentials_V5_V5");
    if (credentialsOfFluency) {
      ObservableHandler.handle(this.schemaService.getDocumentTypesInGroup(credentialsOfFluency, this.parentTargetGroup()))
        .onStart(() => this.loading.set(true))
        .onFinalize(() => this.loading.set(false))
        .onError((error) => {
          console.log("Fail get document types",error)
        })
        .onNext((resolve) => {
          this.targetDocumentTypes.set(resolve.data)
          this.loading.set(false)
        })
        .execute()
    }
  }

  checkItem = (event: Event, docId: string) => {
    event.preventDefault(); // Previene el comportamiento por defecto
    event.stopPropagation(); // Detiene la propagación
    this.docList.update(doctypes => doctypes.map(type => type.docId === docId ? { ...type, checked: true } : { ...type, checked: false }))
    console.log(this.docList())
    const checkedItem = this.docList().find(x => x.checked === true)
    const documentType = this.documentTypesSchemas().find(x => x.documentTypeId == checkedItem.docId)
    this.onDocumentypeSeleted.emit(documentType)
  }

  isChecked = (docId: string) => {
    const checkedItem = this.docList().find(x => x.checked === true)
    if (!checkedItem) {
      return false
    }
    return checkedItem.docId === docId
  }
}
