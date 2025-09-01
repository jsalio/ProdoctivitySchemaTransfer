import { Component, computed, OnInit, signal } from '@angular/core';
import { DocumentTypesListComponent, SchemaDocumentType } from "./document-types-list/document-types-list.component";
import { GroupListComponent, SchemaDocumentGroup } from "./group-list/group-list.component";

import { CommonModule } from "@angular/common";
import { Credentials } from '../../types/models/Credentials';
import { DataElement } from '../../types/contracts/ISchema';
import { DocumentTypeSchemaComponent } from './document-type-schema/document-type-schema.component';
import { LocalDataService } from '../../services/ui/local-data.service';
import { ObservableHandler } from '../../shared/utils/Obserbable-handler';
import { SchemaService } from '../../services/backend/schema.service';
import { DocumetTypeKeyword } from '../../types/models/DocumentTypeKeywordSchema';
import { ActionOrchestrator } from './utils/ActionBuilder';
import { ActionProgress } from './utils/ActionProgress';
import { ActionData } from './utils/ActionData';
import { ActionContext } from './utils/ActionContext';
import { ConditionalActionBuilder } from './utils/ConditionalActionBuilder';
import { TranferResumeService } from '../../services/ui/tranfer-resume.service';
import { Subscription } from 'rxjs';
import { ModalComponent } from '../../shared/modal/modal.component';
import { ActionProgressService } from './utils/ActionProgress.service';
import { ProcessingIndicatorComponent } from "../../shared/processing-indicator/processing-indicator.component";
import { CompleteIndicatorComponent } from "../../shared/complete-indicator/complete-indicator.component";
import { ErrorIndicatorComponent } from "../../shared/error-indicator/error-indicator.component";
import { IndicatorComponent } from '../../shared/indicator/indicator.component';
import { ConnectionStatusService } from '../../services/ui/connection-status.service';

export type stepIndicator = 'processing' | 'completed' | 'error';

@Component({
  selector: 'app-schema-transfer',
  standalone: true,
  imports: [CommonModule, GroupListComponent, DocumentTypesListComponent, DocumentTypeSchemaComponent, ModalComponent, IndicatorComponent],
  templateUrl: './schema-transfer.component.html',
  styleUrl: './schema-transfer.component.css'
})
export class SchemaTransferComponent implements OnInit {
  selectedGroup = signal<SchemaDocumentGroup | null>(null);
  selectedDocumentType = signal<SchemaDocumentType | null>(null)
  loadingDataElements = signal<boolean>(false)
  systemTargetDataElements = signal<DataElement[]>([])
  keywordsSelectedPerDocument = signal<DocumetTypeKeyword[]>([])
  executingActions = signal<boolean>(false)
  resume = signal<ActionData | null>(null)

  modalProcessOpen = signal<boolean>(false)

  resumeSubscription: Subscription | null = null;

  private actionOrchestrator: ActionOrchestrator;
  actionProgress = signal<ActionProgress | null>(null);

  groupStepIndicator = computed<stepIndicator>(() => {
    const status = this.actionProgress()?.steps.find(x => x.stepName == "Create Document Group")?.status
    if (status == "completed") {
      return "completed"
    } else if (status == "error") {
      return "error"
    } else {
      return "processing"
    }
  })

  documentStepIndicator = computed<stepIndicator>(() => {
    if (this.groupStepIndicator() === "error") {
      return "error"
    }
    const status = this.actionProgress()?.steps.find(x => x.stepName == "Create Document Type")?.status
    if (status == "completed") {
      return "completed" 
    } else if (status == "error") {
      return "error" 
    } else {
      return "processing" 
    }
  })
  keywordsStepIndicator = computed<stepIndicator>(() => {
    if (this.documentStepIndicator() === "error") {
      return "error" 
    }
    const status = this.actionProgress()?.steps.find(x => x.stepName == "Create Keywords")?.status
    if (status == "completed") {
      return "completed"
    } else if (status == "error") {
      return "error" 
    } else {
      return "processing" 
    }
  })

  keywordAssignStepIndicator = computed<stepIndicator>(() => {
    if (this.keywordsStepIndicator() === "error") {
      return "error" 
    }
    const status = this.actionProgress()?.steps.find(x => x.stepName == "Assign Keywords")?.status
    if (status == "completed") {
      return "completed"
    } else if (status == "error") {
      return "error" 
    } else {
      return "processing" 
    }
  })

  isCanceledOrAborted = computed<boolean>(() => {
    const steps = this.actionProgress()?.steps;
    if (!steps) return true;
    
    return steps.some(step => 
      step.status === "error"
    );
  });

  /**
   *
   */
  constructor(
    private readonly schema: SchemaService,
    private readonly localData: LocalDataService,
    private readonly tranferResumeService: TranferResumeService,
    private readonly progressService: ActionProgressService,
    private readonly connectionStatusService: ConnectionStatusService
  ) {
    // super();
    this.actionOrchestrator = new ActionOrchestrator(this.schema, this.executingActions, this.tranferResumeService, this.progressService);
  }


  ngOnInit(): void {
    this.connectionStatusService.getStatus$().subscribe((status) => {
      console.log(status)
    })
    const credentialsOfFluency = this.localData.getValue<Credentials>("Credentials_V5_V5");
    if (credentialsOfFluency) {
      this.executeCall(credentialsOfFluency, (response) => {
        this.systemTargetDataElements.set(response.data)
      })
      this.progressService.progress$.subscribe((progress) => {
        // console.log("Report of progress", progress)
        // if (progress === null) return;
        // debugger
        this.actionProgress.set(progress)
        // const status = progress?.steps.find(x => x.stepName == "Create Document Group")?.status
        // if (status == "completed") {
        //   this.groupStepIndicator.set("completed")
        // } else if (status == "error") {
        //   this.groupStepIndicator.set("error")
        // } else {
        //   this.groupStepIndicator.set("processing")
        // }
        // this.documentGroupIndicator()
      })
    }

    this.resumeSubscription = this.tranferResumeService.resumeData().subscribe((resume) => {
      this.resume.set(resume)
      console.log(resume)
    })
  }

  onSelectDocumentGroup = (group: SchemaDocumentGroup) => {
    this.selectedGroup.set(group);
    this.keywordsSelectedPerDocument.set([])
    this.resume.set(null)
  }

  onDocumentTypeSelected = (documentType: SchemaDocumentType) => {
    this.selectedDocumentType.set(documentType)
    this.keywordsSelectedPerDocument.set([])
    console.log(this.selectedDocumentType())
    this.resume.set(null)
  }

  executeCall = (credentials: Credentials, callback: (response: { data: Array<DataElement>, success: boolean }) => void) => {
    ObservableHandler.handle(this.schema.getAllDataElements(credentials))
      .onNext(callback)
      .onStart(() => this.loadingDataElements.set(true))
      .onError((errr) => {
        console.warn(errr)
      })
      .onFinalize(() => this.loadingDataElements.set(false))
      .execute()
  }

  /**
   * Método simplificado que ahora delega toda la lógica al orquestrador
   */
  addKeyToActions = async (event: { isChecked: boolean, keyword: DocumetTypeKeyword, order: number }) => {
    // Actualizar lista de keywords seleccionadas
    if (event.isChecked) {
      this.keywordsSelectedPerDocument.update(current => [...current, event.keyword]);
    } else {
      this.keywordsSelectedPerDocument.update(current =>
        current.filter(x => x.name !== event.keyword.name)
      );
    }

    // Solo proceder si hay keywords seleccionadas
    if (this.keywordsSelectedPerDocument().length === 0) {
      //console.log('ℹ️ No keywords selected');
      return;
    }

    // Obtener credenciales
    const targetCredentials = this.localData.getValue<Credentials>("Credentials_V5_V5");
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
        true
      );

      // Manejar resultados
      this.handleActionResults(result);

    } catch (error) {
      //console.error('💥 Action execution failed:', error);
      this.handleActionError(error);
    }
  }


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
  private handleActionError(error: any) {
    // Mostrar notificación de error, log, etc.
    //console.error('Action execution failed:', error);
  }

  private refreshDataIfNeeded() {
    // Recargar datos si es necesario
    // this.ngOnInit(); // O el método específico para recargar
  }


  applyChanges = async () => {
    this.modalProcessOpen.set(true)
    this.executingActions.set(true)

    const targetCredentials = this.localData.getValue<Credentials>("Credentials_V5_V5");
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
      {
        onStepStart: (step) => {
          //console.log(`🔄 Starting: ${step.stepName}`);
        },
        onStepComplete: (step) => {
          //console.log(`✅ Completed: ${step.stepName}`);
        },
        onStepError: (step) => {
          //console.log(`❌ Error in: ${step.stepName}`, step.error);
        },
        onActionComplete: (progress) => {
          //console.log(`🏆 All actions completed in ${this.calculateIntervalDiffInSeconds(progress.startTime, progress.endTime)}ms`);
        },
        onActionError: (progress) => {
          //console.log(`💥 Action chain failed`);
        }
      }
    );

    this.handleActionResults(result);
  }

  calculateIntervalDiffInSeconds = (startTime: Date, endTime: Date) => {
    const diff = endTime.getTime() - startTime.getTime();
    return diff / 1000;
  }


  handlerModalClose = () => {
    this.modalProcessOpen.set(false);
    this.executingActions.set(false);
  }

  hanlderModalCloseForSuccess = () => {
    this.modalProcessOpen.set(false);
    this.executingActions.set(false);
    window.location.reload();
  }

  goToForm = () => {
    const targetCredentials = this.localData.getValue<Credentials>("Credentials_V5_V5");
    if (!targetCredentials) {
      console.error('❌ No target credentials available');
      return;
    }
    window.open(targetCredentials.serverInformation.server+`/Site/ProDoctivity.aspx#/form-designer/${this.selectedDocumentType()?.targetDocumentType}`)
  }
}
