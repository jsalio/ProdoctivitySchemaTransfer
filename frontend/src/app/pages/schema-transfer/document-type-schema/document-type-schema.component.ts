import { Component, OnChanges, OnDestroy, Signal, SimpleChanges, WritableSignal, computed, input, signal } from '@angular/core';

import { Credentials } from '../../../types/models/Credentials';
import { DocumentTypeKeywordSchema } from '../../../types/models/DocumentTypeKeywordSchema';
import { LocalDataService } from '../../../services/ui/local-data.service';
import { ModalComponent } from "../../../shared/modal/modal.component";
import { ObservableHandler } from '../../../shared/utils/Obserbable-handler';
import { SchemaDocumentType } from '../../../types/models/SchemaDocumentType';
import { SchemaService } from '../../../services/backend/schema.service';

@Component({
  selector: 'app-document-type-schema',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './document-type-schema.component.html',
  styleUrl: './document-type-schema.component.css'
})
export class DocumentTypeSchemaComponent implements OnChanges, OnDestroy {
  documentTypeID = input<string>('')
  targetDocumentTypeId = input<string>('')
  sourceDocumentSchema = signal<SchemaDocumentType | null>(null)
  loadingSource = signal<boolean>(false)
  loadingTarget = signal<boolean>(false)
  targetDocumentSchema = signal<SchemaDocumentType | null>(null)

  errorModalOpen = signal<boolean>(false)
  storeMessageFailured = signal<string>('')

  // Para trackear los valores anteriores y evitar llamadas duplicadas
  private previousSourceId: string | null = null;
  private previousTargetId: string | null = null;

  // Computed para el estado de carga general
  isLoading = computed(() => this.loadingSource() || this.loadingTarget());

  // Computed para verificar si ambos esquemas están listos
  schemasReady = computed(() => {
    return this.sourceDocumentSchema() !== null && this.targetDocumentSchema() !== null;
  });

  documentSchema = computed(() => {
    const sourceSchema = this.sourceDocumentSchema();
    const targetSchema = this.targetDocumentSchema();

    // Solo procesar si ambos esquemas están disponibles
    if (!sourceSchema || !targetSchema) {
      return null;
    }

    const isPartOfSchema = (keyName: string): boolean => {
      if (!targetSchema.keywords) return false;

      const keyword = targetSchema.keywords.find(x =>
        x.name?.toLocaleLowerCase() === keyName?.toLocaleLowerCase()
      );
      return keyword !== undefined;
    }

    const currentSchema: DocumentTypeKeywordSchema = {
      name: sourceSchema.name,
      documentTypeId: sourceSchema.documentTypeId,
      keywords: (sourceSchema.keywords || []).map(k => ({
        dataType: k.dataType,
        isSync: isPartOfSchema(k.name),
        label: k.label,
        name: k.name,
        require: k.require
      }))
    }

    return currentSchema;
  })

  constructor(
    private readonly localData: LocalDataService,
    private readonly schemaService: SchemaService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    const currentSourceId = this.documentTypeID();
    const currentTargetId = this.targetDocumentTypeId();

    // Verificar si realmente hay cambios
    const sourceIdChanged = currentSourceId !== this.previousSourceId;
    const targetIdChanged = currentTargetId !== this.previousTargetId;

    if (!sourceIdChanged && !targetIdChanged) {
      return;
    }

    // Limpiar esquemas anteriores cuando cambian los IDs
    if (sourceIdChanged) {
      this.sourceDocumentSchema.set(null);
      this.previousSourceId = currentSourceId;
    }

    if (targetIdChanged) {
      this.targetDocumentSchema.set(null);
      this.previousTargetId = currentTargetId;
    }

    console.log('Document type IDs changed - Source:', currentSourceId, 'Target:', currentTargetId);

    // Cargar esquemas solo si los IDs son válidos
    this.loadSchemasIfValid(currentSourceId, currentTargetId);
  }

  ngOnDestroy(): void {
    // Limpiar cualquier subscription pendiente si es necesario
    // ObservableHandler podría necesitar cleanup aquí
  }

  private loadSchemasIfValid(sourceId: string, targetId: string): void {
    // Cargar schema de origen
    if (this.isValidId(sourceId)) {
      const credentialOfCloud = this.localData.getValue<Credentials>("Credentials_V6_Cloud");
      if (credentialOfCloud) {
        this.loadSourceSchema(credentialOfCloud, sourceId);
      } else {
        console.warn('No se encontraron credenciales para Productivity Cloud (V6)');
      }
    }

    // Cargar schema de destino
    if (this.isValidId(targetId)) {
      const credentialOfFluency = this.localData.getValue<Credentials>("Credentials_V5_V5");
      if (credentialOfFluency) {
        this.loadTargetSchema(credentialOfFluency, targetId);
      } else {
        console.warn('No se encontraron credenciales para Productivity Fluency (V5)');
      }
    }
  }

  private isValidId(id: string | null | undefined): boolean {
    return id !== null && id !== undefined && id.trim() !== '';
  }

  private loadSourceSchema(credentials: Credentials, documentTypeId: string): void {
    this.executeCall(
      credentials, 
      documentTypeId, 
      (response) => {
        this.sourceDocumentSchema.set(response.data);
      }, 
      this.loadingSource, 
      () => {
        this.showError('Productivity Cloud (V6)');
      }
    );
  }

  private loadTargetSchema(credentials: Credentials, documentTypeId: string): void {
    this.executeCall(
      credentials, 
      documentTypeId, 
      (response) => {
        this.targetDocumentSchema.set(response.data);
      }, 
      this.loadingTarget, 
      () => {
        this.showError('Productivity Fluency (V5)');
      }
    );
  }

  private executeCall = (
    credentials: Credentials,
    documentTypeId: string,
    callback: (response: { data: SchemaDocumentType, success: boolean }) => void,
    loadingSignal: WritableSignal<boolean>,
    errorCallback?: () => void
  ): void => {
    ObservableHandler.handle(this.schemaService.getDocumentTypeSchema(credentials, documentTypeId))
      .onStart(() => loadingSignal.set(true))
      .onNext(callback)
      .onError((error) => {
        console.error('Error loading document schema:', error);
        errorCallback?.();
      })
      .onFinalize(() => loadingSignal.set(false))
      .execute();
  }

  private showError(systemName: string): void {
    this.storeMessageFailured.set(systemName);
    this.errorModalOpen.set(true);
  }

  onModalHandlerClose = (): void => {
    this.errorModalOpen.set(false);
    this.storeMessageFailured.set('');
  }
}