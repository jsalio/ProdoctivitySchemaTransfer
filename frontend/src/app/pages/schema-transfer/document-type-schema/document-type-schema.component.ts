import { Component, OnChanges, SimpleChanges, input, signal } from '@angular/core';

import { Credentials } from '../../../types/models/Credentials';
import { LocalDataService } from '../../../services/ui/local-data.service';
import { SchemaService } from '../../../services/backend/schema.service';

export interface SchemaDocumentType{
  name: string
  documentTypeId: string
  keywords: {
      name: string
      label: string,
      dataType: string,
      require: boolean
  }[]
}

@Component({
  selector: 'app-document-type-schema',
  standalone: true,
  imports: [],
  templateUrl: './document-type-schema.component.html',
  styleUrl: './document-type-schema.component.css'
})
export class DocumentTypeSchemaComponent implements OnChanges {
  documentTypeID = input<string>('')
  documentSchema = signal<SchemaDocumentType| null>(null)
  loading= signal<boolean>(false)

  /**
   *
   */
  constructor(private readonly localData: LocalDataService, private readonly schemaService: SchemaService) {

  }

  ngOnChanges(changes: SimpleChanges): void {
      console.log(this.documentTypeID())
      if (this.documentTypeID() === null){
        return
      }
      const credentialOfcloud = this.localData.getValue<Credentials>("Credentials_V6_Cloud");
      if (!credentialOfcloud)
      {
        return
      }
      this.loading.set(true)
      this.schemaService.getDocumentTypeSchema(credentialOfcloud, this.documentTypeID()).subscribe((data) => {
        this.documentSchema.set(data.data)
        this.loading.set(false)
      })

  }
}
