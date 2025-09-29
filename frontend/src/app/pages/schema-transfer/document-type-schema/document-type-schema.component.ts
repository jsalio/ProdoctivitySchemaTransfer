import {
  Component,
  OnChanges,
  WritableSignal,
  computed,
  input,
  output,
  signal,
  inject,
} from '@angular/core';

import { Credentials } from '../../../types/models/Credentials';
import { DataElement } from '../../../types/contracts/ISchema';
import {
  DocumentTypeKeywordSchema,
  DocumetTypeKeyword,
} from '../../../types/models/DocumentTypeKeywordSchema';
import { LocalDataService } from '../../../services/ui/local-data.service';
import { ObservableHandler } from '../../../shared/utils/Obserbable-handler';
import { SchemaDocumentType } from '../../../types/models/SchemaDocumentType';
import { SchemaService } from '../../../services/backend/schema.service';
import { IconographyComponent } from '../../../shared/iconography/iconography.component';

@Component({
  selector: 'app-document-type-schema',
  standalone: true,
  imports: [IconographyComponent],
  templateUrl: './document-type-schema.component.html',
  styleUrl: './document-type-schema.component.css',
})
export class DocumentTypeSchemaComponent implements OnChanges {
  private readonly localData = inject(LocalDataService);
  private readonly schemaService = inject(SchemaService);

  documentTypeID = input<string>('');
  targetDocumentTypeId = input<string>('');
  targetSystemDataElements = input<DataElement[]>([]);

  sourceDocumentSchema = signal<SchemaDocumentType | null>(null);
  loadingSource = signal<boolean>(false);
  loadingTarget = signal<boolean>(false);
  targetDocumentSchema = signal<SchemaDocumentType | null>(null);
  errorModalOpen = signal<boolean>(false);
  storeMessageFailured = signal<string>('');
  order = signal<number>(0);

  keySelected = output<{ isChecked: boolean; keyword: DocumetTypeKeyword; order: number }>();

  // Para trackear los valores anteriores y evitar llamadas duplicadas
  private previousSourceId: string | null = null;
  private previousTargetId: string | null = null;

  // Computed para el estado de carga general
  isLoading = computed(() => this.loadingSource() || this.loadingTarget());

  // Computed para verificar si al menos el schema fuente está listo
  sourceSchemaReady = computed(() => {
    return this.sourceDocumentSchema() !== null;
  });

  // Computed para verificar si ambos esquemas están listos
  bothSchemasReady = computed(() => {
    return this.sourceDocumentSchema() !== null && this.targetDocumentSchema() !== null;
  });

  documentSchema = computed(() => {
    const sourceSchema = this.sourceDocumentSchema();
    const targetSchema = this.targetDocumentSchema();

    // Solo necesitamos el esquema fuente para mostrar las llaves
    if (!sourceSchema) {
      return null;
    }

    const isPartOfSchema = (keyName: string): boolean => {
      // Si no hay schema target, ninguna llave está sincronizada
      if (!targetSchema || !targetSchema.keywords) return false;

      const keyword = targetSchema.keywords.find(
        (x) => x.name?.toLocaleLowerCase() === keyName?.toLocaleLowerCase(),
      );
      return keyword !== undefined;
    };

    const isInTarget = (keyname: string): boolean => {
      if (this.targetSystemDataElements().length === 0) {
        //console.log('No exits 1')
        return false;
      }
      const elementInTarget = this.targetSystemDataElements().find(
        (x) => x.name.toLocaleLowerCase() === keyname.toLocaleLowerCase(),
      );

      if (!elementInTarget) {
        //console.log('No exits 2')
        return false;
      }
      return true;
    };

    const getTargetKeywordId = (keyName: string): string => {
      const keyword = this.targetSystemDataElements().find(
        (x) => x.name.toLocaleLowerCase() === keyName.toLocaleLowerCase(),
      );
      return keyword?.id || '';
    };

    const currentSchema: DocumentTypeKeywordSchema = {
      name: sourceSchema.name,
      documentTypeId: sourceSchema.documentTypeId,
      keywords: (sourceSchema.keywords || []).map((k, index) => ({
        dataType: k.dataType,
        order: isPartOfSchema(k.name) ? index + 1 : 0,
        isSync: isPartOfSchema(k.name),
        label: k.label,
        name: k.name,
        require: k.require,
        presentInTarget: isInTarget(k.name),
        targetKeywordId: getTargetKeywordId(k.name),
      })),
    };

    return currentSchema;
  });

  ngOnChanges(): void {
    console.log(this.documentTypeID());
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

    //console.log('Document type IDs changed - Source:', currentSourceId, 'Target:', currentTargetId);

    // Cargar esquemas solo si los IDs son válidos
    this.loadSchemasIfValid(currentSourceId, currentTargetId);
  }

  private loadSchemasIfValid(sourceId: string, targetId: string): void {
    // Cargar schema de origen
    if (this.isValidId(sourceId)) {
      const credentialOfCloud = this.localData.getValue<Credentials>('Credentials_V6_Cloud');
      if (credentialOfCloud) {
        this.loadSourceSchema(credentialOfCloud, sourceId);
      } else {
        console.warn('No se encontraron credenciales para Productivity Cloud (V6)');
      }
    }

    // Cargar schema de destino
    if (this.isValidId(targetId)) {
      const credentialOfFluency = this.localData.getValue<Credentials>('Credentials_V5_V5');
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
      },
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
      },
    );
  }

  private executeCall = (
    credentials: Credentials,
    documentTypeId: string,
    callback: (response: { data: SchemaDocumentType; success: boolean }) => void,
    loadingSignal: WritableSignal<boolean>,
    errorCallback?: () => void,
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
  };

  private showError(systemName: string): void {
    this.storeMessageFailured.set(systemName);
    this.errorModalOpen.set(true);
  }

  onModalHandlerClose = (): void => {
    this.errorModalOpen.set(false);
    this.storeMessageFailured.set('');
  };

  markKeyword = (event: Event, keyword: DocumetTypeKeyword) => {
    event.stopPropagation();
    event.preventDefault();
    const isChecked = (event.target as HTMLInputElement).checked;
    const keyspresentInTarget =
      this.documentSchema()?.keywords.filter((x) => x.presentInTarget).length || 0;
    // if (isChecked) {
    //   this.order.set(keyspresentInTarget + 1)
    // } else {
    //   this.order.set(keyspresentInTarget - 1)
    // }
    // console.log(this.order())
    this.keySelected.emit({ isChecked: isChecked, keyword: keyword, order: keyspresentInTarget });
  };

  fieldIsTypeImage = (field: DocumetTypeKeyword) => {
    return field.dataType === 'Image';
  };
}
