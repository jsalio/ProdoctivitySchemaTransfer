import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DocumentTypesListComponent } from './document-types-list/document-types-list.component';
import { SchemaDocumentType } from '../../types/models/DocumentType';
import { GroupListComponent } from './group-list/group-list.component';
import { SchemaDocumentGroup } from '../../types/models/SchemaDocumentGroup';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SchemaService } from '../../services/backend/schema.service';
import { LocalDataService } from '../../services/ui/local-data.service';
import { TranferResumeService } from '../../services/ui/tranfer-resume.service';
import { IndicatorComponent } from '../../shared/indicator/indicator.component';
import { ModalComponent } from '../../shared/modal/modal.component';
import { ObservableHandler } from '../../shared/utils/Obserbable-handler';
import { DataElement } from '../../types/contracts/ISchema';
import { Credentials } from '../../types/models/Credentials';
import { DocumetTypeKeyword } from '../../types/models/DocumentTypeKeywordSchema';
import { DocumentTypeSchemaComponent } from './document-type-schema/document-type-schema.component';
import { ActionOrchestrator } from './utils/ActionBuilder';
import { ActionContext } from './utils/ActionContext';
import { ActionData } from './utils/ActionData';
import { ActionProgress } from './utils/ActionProgress';
import { ActionProgressService } from './utils/ActionProgress.service';

export type stepIndicator = 'processing' | 'completed' | 'error';

@Component({
  selector: 'app-schema-transfer',
  standalone: true,
  imports: [
    CommonModule,
    GroupListComponent,
    DocumentTypesListComponent,
    DocumentTypeSchemaComponent,
    ModalComponent,
    IndicatorComponent,
  ],
  templateUrl: './schema-transfer.component.html',
  styleUrl: './schema-transfer.component.css',
})
export class SchemaTransferComponent implements OnInit {
  private readonly schema = inject(SchemaService);
  private readonly localData = inject(LocalDataService);
  private readonly tranferResumeService = inject(TranferResumeService);
  private readonly progressService = inject(ActionProgressService);

  selectedGroup = signal<SchemaDocumentGroup | null>(null);
  selectedDocumentType = signal<SchemaDocumentType | null>(null);
  loadingDataElements = signal<boolean>(false);
  systemTargetDataElements = signal<DataElement[]>([]);
  keywordsSelectedPerDocument = signal<DocumetTypeKeyword[]>([]);
  executingActions = signal<boolean>(false);
  resume = signal<ActionData | null>(null);
  modalViewMode = signal<'Execute' | 'Preview'>('Execute');

  modalProcessOpen = signal<boolean>(false);

  resumeSubscription: Subscription | null = null;

  private actionOrchestrator: ActionOrchestrator;
  actionProgress = signal<ActionProgress | null>(null);

  groupStepIndicator = computed<stepIndicator>(() => {
    const status = this.actionProgress()?.steps.find(
      (x) => x.stepName == 'Create Document Group',
    )?.status;
    if (status == 'completed') {
      return 'completed';
    } else if (status == 'error') {
      return 'error';
    } else {
      return 'processing';
    }
  });

  documentStepIndicator = computed<stepIndicator>(() => {
    if (this.groupStepIndicator() === 'error') {
      return 'error';
    }
    const status = this.actionProgress()?.steps.find(
      (x) => x.stepName == 'Create Document Type',
    )?.status;
    if (status == 'completed') {
      return 'completed';
    } else if (status == 'error') {
      return 'error';
    } else {
      return 'processing';
    }
  });
  keywordsStepIndicator = computed<stepIndicator>(() => {
    if (this.documentStepIndicator() === 'error') {
      return 'error';
    }
    const status = this.actionProgress()?.steps.find(
      (x) => x.stepName == 'Create Keywords',
    )?.status;
    if (status == 'completed') {
      return 'completed';
    } else if (status == 'error') {
      return 'error';
    } else {
      return 'processing';
    }
  });

  keywordAssignStepIndicator = computed<stepIndicator>(() => {
    if (this.keywordsStepIndicator() === 'error') {
      return 'error';
    }
    const status = this.actionProgress()?.steps.find(
      (x) => x.stepName == 'Assign Keywords',
    )?.status;
    if (status == 'completed') {
      return 'completed';
    } else if (status == 'error') {
      return 'error';
    } else {
      return 'processing';
    }
  });

  isCanceledOrAborted = computed<boolean>(() => {
    const steps = this.actionProgress()?.steps;
    if (!steps) return true;

    return steps.some((step) => step.status === 'error');
  });

  /**
   *
   */
  constructor() {
    // super();
    this.actionOrchestrator = new ActionOrchestrator(
      this.schema,
      this.executingActions,
      this.tranferResumeService,
      this.progressService,
    );
  }

  ngOnInit(): void {
    const credentialsOfFluency = this.localData.getValue<Credentials>('Credentials_V5_V5');
    if (credentialsOfFluency) {
      this.executeCall(credentialsOfFluency, (response) => {
        this.systemTargetDataElements.set(response.data);
      });
      this.progressService.progress$.subscribe((progress) => {
        this.actionProgress.set(progress);
      });
    }

    this.resumeSubscription = this.tranferResumeService.resumeData().subscribe((resume) => {
      this.resume.set(resume);
      console.log(resume);
    });
  }

  onSelectDocumentGroup = (group: SchemaDocumentGroup) => {
    this.selectedGroup.set(group);
    this.keywordsSelectedPerDocument.set([]);
    this.selectedDocumentType.set(null);
    this.resume.set(null);
  };

  onDocumentTypeSelected = (documentType: SchemaDocumentType) => {
    this.selectedDocumentType.set(documentType);
    this.keywordsSelectedPerDocument.set([]);
    console.log(this.selectedDocumentType());
    this.resume.set(null);
  };

  executeCall = (
    credentials: Credentials,
    callback: (response: { data: DataElement[]; success: boolean }) => void,
  ) => {
    ObservableHandler.handle(this.schema.getAllDataElements(credentials))
      .onNext(callback)
      .onStart(() => this.loadingDataElements.set(true))
      .onError((errr) => {
        console.warn(errr);
      })
      .onFinalize(() => this.loadingDataElements.set(false))
      .execute();
  };

  /**
   * Método simplificado que ahora delega toda la lógica al orquestrador
   */
  addKeyToActions = async (event: {
    isChecked: boolean;
    keyword: DocumetTypeKeyword;
    order: number;
  }) => {
    // Actualizar lista de keywords seleccionadas
    if (event.isChecked) {
      this.keywordsSelectedPerDocument.update((current) => [...current, event.keyword]);
    } else {
      this.keywordsSelectedPerDocument.update((current) =>
        current.filter((x) => x.name !== event.keyword.name),
      );
    }

    // Solo proceder si hay keywords seleccionadas
    if (this.keywordsSelectedPerDocument().length === 0) {
      //console.log('ℹ️ No keywords selected');
      return;
    }

    // Obtener credenciales
    const targetCredentials = this.localData.getValue<Credentials>('Credentials_V5_V5');
    if (!targetCredentials) {
      //console.error('❌ No target credentials available');
      return;
    }

    try {
      // Delegar toda la lógica al orquestrador
      const result = await this.actionOrchestrator.executeActionsFromConditions(
        targetCredentials,
        this.keywordsSelectedPerDocument(),
        this.selectedGroup()!,
        this.selectedDocumentType()!,
        true,
      );

      // Manejar resultados
      this.handleActionResults(result);
    } catch (error) {
      //console.error('💥 Action execution failed:', error);
      this.handleActionError(error);
    }
  };

  /**
   * Maneja los resultados exitosos de las acciones
   */
  private handleActionResults(results: ActionContext) {
    if (results.documentGroupId) {
      //console.log('📁 New group created with ID:', results.documentGroupId);
      // Actualizar UI si es necesario
    }

    if (results.documentTypeId) {
      //console.log('📄 New document type created with ID:', results.documentTypeId);
      // Actualizar UI si es necesario
    }

    if (results.createdKeywords?.length) {
      //console.log('🏷️ Keywords created:', results.createdKeywords.length);
    }

    if (results.assignedSchemas?.length) {
      //console.log('🔗 Schemas assigned:', results.assignedSchemas.length);
    }

    // Aquí puedes actualizar señales, mostrar notificaciones, recargar datos, etc.
    this.refreshDataIfNeeded();
  }

  /**
   * Maneja errores en la ejecución de acciones
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private handleActionError(error: Error) {
    // Mostrar notificación de error, log, etc.
    //console.error('Action execution failed:', error);
  }

  private refreshDataIfNeeded() {
    // Recargar datos si es necesario
    // this.ngOnInit(); // O el método específico para recargar
  }

  applyChanges = async () => {
    this.modalViewMode.set('Execute');
    this.modalProcessOpen.set(true);
    this.executingActions.set(true);

    const targetCredentials = this.localData.getValue<Credentials>('Credentials_V5_V5');
    if (!targetCredentials) {
      //console.error('❌ No target credentials available');
      return;
    }

    const result = await this.actionOrchestrator.executeActionsFromConditions(
      targetCredentials,
      this.keywordsSelectedPerDocument(),
      this.selectedGroup()!,
      this.selectedDocumentType()!,
      false,
    );

    this.handleActionResults(result);
  };

  calculateIntervalDiffInSeconds = (startTime: Date, endTime: Date) => {
    const diff = endTime.getTime() - startTime.getTime();
    return diff / 1000;
  };

  handlerModalClose = () => {
    this.modalProcessOpen.set(false);
    this.executingActions.set(false);
  };

  hanlderModalCloseForSuccess = () => {
    this.modalProcessOpen.set(false);
    this.executingActions.set(false);
    window.location.reload();
  };

  goToForm = () => {
    const targetCredentials = this.localData.getValue<Credentials>('Credentials_V5_V5');
    if (!targetCredentials) {
      console.error('❌ No target credentials available');
      return;
    }
    window.open(
      targetCredentials.serverInformation.server +
        `/Site/ProDoctivity.aspx#/form-designer/${this.selectedDocumentType()?.targetDocumentType}`,
    );
  };

  openPreviewChanges = () => {
    this.modalViewMode.set('Preview');
    this.modalProcessOpen.set(true);
  };

  closePreviewHandle = () => {
    this.modalViewMode.set('Execute');
    this.modalProcessOpen.set(false);
  };
}
