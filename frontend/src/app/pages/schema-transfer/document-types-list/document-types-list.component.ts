import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  SimpleChanges,
  WritableSignal,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

import { Credentials } from '../../../types/models/Credentials';
import { LocalDataService } from '../../../services/ui/local-data.service';
import { ObservableHandler } from '../../../shared/utils/Obserbable-handler';
import { SchemaService } from '../../../services/backend/schema.service';
import { DocumentType, SchemaDocumentType } from '../../../types/DocumentType';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Filter } from '../utils/FilterDatalist';

@Component({
  selector: 'app-document-types-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './document-types-list.component.html',
  styleUrl: './document-types-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentTypesListComponent implements OnChanges {
  private readonly localData = inject(LocalDataService);
  private readonly schemaService = inject(SchemaService);

  parentGroup = input<string>('');
  parentTargetGroup = input<string>('');
  filter = signal<string>('');

  documentTypes = signal<DocumentType[]>([]);
  targetDocumentTypes = signal<DocumentType[]>([]);
  loadingSource = signal<boolean>(false);
  loadingTarget = signal<boolean>(false);
  selectedDocumentId = signal<string | null>(null); // ✅ Simplificado
  errorModalOpen = signal<boolean>(false);
  storeMessageFailured = signal<string>('');

  // ✅ Memoización para mejor performance
  private targetDocumentTypesMap = computed(() => {
    const map = new Map<string, string>();
    this.targetDocumentTypes().forEach((target) => {
      map.set(target.documentTypeName, target.documentTypeId);
    });
    return map;
  });

  // ✅ Computed optimizado
  documentTypesSchemas = computed(() => {
    const targetMap = this.targetDocumentTypesMap();

    const dataSet = this.documentTypes().map(
      (x) =>
        ({
          documentTypeId: x.documentTypeId,
          documentTypeName: x.documentTypeName,
          targetDocumentType: targetMap.get(x.documentTypeName) || '',
        }) as SchemaDocumentType,
    );

    if (this.filter() !== '') {
      return Filter(this.filter(), 'documentTypeName', dataSet);
    }

    return dataSet;
  });

  documentypeSeleted = output<SchemaDocumentType>();

  ngOnChanges(changes: SimpleChanges): void {
    // ✅ Solo ejecutar si los inputs específicos cambiaron
    if (changes['parentGroup'] && this.parentGroup()) {
      this.loadSourceDocumentTypes();
    }

    if (changes['parentTargetGroup'] && this.parentTargetGroup()) {
      this.loadTargetDocumentTypes();
    }
  }

  // ✅ Métodos separados para mejor organización
  private loadSourceDocumentTypes(): void {
    const credentials = this.localData.getValue<Credentials>('Credentials_V6_Cloud');
    if (!credentials) return;

    this.documentTypes.set([]);
    this.selectedDocumentId.set(null);

    this.executeCall(
      credentials,
      this.parentGroup(),
      (response) => {
        this.documentTypes.set(response.data);
      },
      this.loadingSource,
      () => {
        this.errorModalOpen.set(true);
        this.storeMessageFailured.set('Productivity Cloud (V6)');
      },
    );
  }

  private loadTargetDocumentTypes(): void {
    const credentials = this.localData.getValue<Credentials>('Credentials_V5_V5');
    if (!credentials) return;

    this.executeCall(
      credentials,
      this.parentTargetGroup(),
      (response) => {
        this.targetDocumentTypes.set(response.data);
      },
      this.loadingTarget, // ✅ Corregido: usar loadingTarget
      () => {
        this.errorModalOpen.set(true);
        this.storeMessageFailured.set('Productivity Fluency (V5)');
      },
    );
  }

  checkItem = (event: Event, docId: string): void => {
    event.preventDefault();
    event.stopPropagation();

    this.selectedDocumentId.set(docId);

    // ✅ Buscar una sola vez
    const documentType = this.documentTypesSchemas().find((x) => x.documentTypeId === docId);
    if (documentType) {
      this.documentypeSeleted.emit(documentType);
    }
  };

  // ✅ Método simplificado
  isChecked = (docId: string): boolean => {
    return this.selectedDocumentId() === docId;
  };

  private executeCall = (
    credentials: Credentials,
    groupId: string,
    callback: (response: { data: DocumentType[]; success: boolean }) => void,
    loadingSignal: WritableSignal<boolean>,
    errorCallback?: () => void,
  ): void => {
    ObservableHandler.handle(this.schemaService.getDocumentTypesInGroup(credentials, groupId))
      .onStart(() => loadingSignal.set(true))
      .onNext(callback)
      .onError((error) => {
        console.error('Error loading document schema:', error);
        errorCallback?.();
      })
      .onFinalize(() => loadingSignal.set(false))
      .execute();
  };
}
