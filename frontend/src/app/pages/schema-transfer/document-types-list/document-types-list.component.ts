import { ChangeDetectionStrategy, Component, OnChanges, SimpleChanges, input, output, signal } from '@angular/core';

import { Credentials } from '../../../types/models/Credentials';
import { LocalDataService } from '../../../services/ui/local-data.service';
import { SchemaService } from '../../../services/backend/schema.service';

export interface DocumentType {
  documentTypeId: string,
  documentTypeName: string,
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
  documentTypes = signal<DocumentType[]>([])
  loading = signal<boolean>(false)
  docList = signal<{ checked: boolean, docId: string }[]>([])
  onDocumentypeSeleted = output<DocumentType>()
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
      this.schemaService.getDocumentTypesInGroup(credentialOfcloud, this.parentGroup()).subscribe((schema) => {
        this.documentTypes.set(schema.data)
        this.loading.set(false)
        this.docList.set(this.documentTypes().map(x => ({ checked: false, docId: x.documentTypeId })))
      })
    }
  }

  checkItem = (event: Event, docId: string) => {
    event.preventDefault(); // Previene el comportamiento por defecto
    event.stopPropagation(); // Detiene la propagación
    this.docList.update(doctypes => doctypes.map(type => type.docId === docId ? { ...type, checked: true } : { ...type, checked: false }))
    console.log(this.docList())
    const checkedItem = this.docList().find(x => x.checked === true)
    const documentType = this.documentTypes().find(x => x.documentTypeId == checkedItem.docId)
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
