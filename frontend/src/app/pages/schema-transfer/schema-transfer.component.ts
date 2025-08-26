import { Component, OnInit, signal } from '@angular/core';
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
import { ActionContext, ActionData, ActionOrchestrator, ConditionalActionBuilder } from './ActionBuilder';
import { TranferResumeService } from '../../services/ui/tranfer-resume.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-schema-transfer',
  standalone: true,
  imports: [CommonModule, GroupListComponent, DocumentTypesListComponent, DocumentTypeSchemaComponent],
  templateUrl: './schema-transfer.component.html',
  styleUrl: './schema-transfer.component.css'
})
export class SchemaTransferComponent implements OnInit {
  selectedGroup = signal<SchemaDocumentGroup | null>(null);
  selectedDocumentType = signal<SchemaDocumentType | null>(null)
  loadingDataElements = signal<boolean>(false)
  systemTargetDataElements = signal<DataElement[]>([])
  keywordsSelectedPerDocument = signal<DocumetTypeKeyword[]>([])
  exeutingActions = signal<boolean>(false)
  resume = signal<ActionData | null>(null)

  resumeSubscription: Subscription | null = null;

  private actionOrchestrator: ActionOrchestrator;
  /**
   *
   */
  constructor(
    private readonly schema: SchemaService, 
    private readonly localData: LocalDataService, 
    private readonly tranferResumeService: TranferResumeService) {
    // super();
    this.actionOrchestrator = new ActionOrchestrator(this.schema, this.exeutingActions, this.tranferResumeService);

  }


  ngOnInit(): void {
    const credentialsOfFluency = this.localData.getValue<Credentials>("Credentials_V5_V5");
    if (credentialsOfFluency) {
      this.executeCall(credentialsOfFluency, (response) => {
        console.log(response)
        this.systemTargetDataElements.set(response.data)
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
  }

  onDocumentTypeSelected = (documentType: SchemaDocumentType) => {
    this.selectedDocumentType.set(documentType)
    this.keywordsSelectedPerDocument.set([])
  }

  // addKeyToActions = (event: { isChecked: boolean, keyword: DocumetTypeKeyword }) => {
  //   if (event.isChecked) {
  //     this.keywordsSelectedPerDocument.update(current => [
  //       ...current,
  //       event.keyword
  //     ])
  //   } else {
  //     this.keywordsSelectedPerDocument.update(current => current.filter(x => x.name === event.keyword.name))
  //   }
  //   console.log(this.keywordsSelectedPerDocument())
  //   const keywordForCreateAndAssign = this.keywordsSelectedPerDocument().filter(x => !x.isSync && !x.presentInTarget)
  //   const keywordForOnlyAssign = this.keywordsSelectedPerDocument().filter(x => !x.isSync && x.presentInTarget)
  //   const requiredCreateDocumentType = this.selectedDocumentType().targetDocumentType === null;
  //   const requiredCreatedDocumentGroup = this.selectedGroup().targetId === null;
  //   console.log({
  //     createDocumentGroup: requiredCreatedDocumentGroup,
  //     createDocumentType: requiredCreateDocumentType,
  //     keywordForCreateAndAssign,
  //     keywordForOnlyAssign
  //   });

  //   const assignKeywordRequest = keywordForOnlyAssign.map(x => ({
  //     documentTypeId: this.selectedDocumentType().targetDocumentType,
  //     keywordId: x.targetKeywordId,
  //     name: x.name,
  //   }))

  //   const createKeywordRequest = keywordForCreateAndAssign.map(x => ({
  //     documentTypeId: this.selectedDocumentType().targetDocumentType,
  //     name: x.name,
  //     dataType: x.dataType,
  //     require: x.require,
  //     label: x.label,
  //   }))

  //   const createDocumentTypeRequest = () => {
  //     if (!requiredCreateDocumentType) {
  //       return null
  //     }
  //     return {
  //       name: this.selectedDocumentType().documentTypeName,
  //       documentGroupId: this.selectedGroup().targetId,
  //     }
  //   }

  //   const createDocumentGroupRequest = () => {
  //     if (!requiredCreatedDocumentGroup) {
  //       return null
  //     }
  //     return {
  //       name: this.selectedGroup().groupName,
  //     }
  //   }


  // }

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
  addKeyToActions = async (event: { isChecked: boolean, keyword: DocumetTypeKeyword }) => {
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
      console.log('ℹ️ No keywords selected');
      return;
    }

    // Obtener credenciales
    const targetCredentials = this.localData.getValue<Credentials>("Credentials_V5_V5");
    if (!targetCredentials) {
      console.error('❌ No target credentials available');
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
      console.error('💥 Action execution failed:', error);
      this.handleActionError(error);
    }
  }


  /**
   * Maneja los resultados exitosos de las acciones
   */
  private handleActionResults(results: ActionContext) {
    if (results.documentGroupId) {
      console.log('📁 New group created with ID:', results.documentGroupId);
      // Actualizar UI si es necesario
    }

    if (results.documentTypeId) {
      console.log('📄 New document type created with ID:', results.documentTypeId);
      // Actualizar UI si es necesario
    }

    if (results.createdKeywords?.length) {
      console.log('🏷️ Keywords created:', results.createdKeywords.length);
    }

    if (results.assignedSchemas?.length) {
      console.log('🔗 Schemas assigned:', results.assignedSchemas.length);
    }

    // Aquí puedes actualizar señales, mostrar notificaciones, recargar datos, etc.
    this.refreshDataIfNeeded();
  }

  /**
  * Maneja errores en la ejecución de acciones
  */
  private handleActionError(error: any) {
    // Mostrar notificación de error, log, etc.
    console.error('Action execution failed:', error);
  }

  private refreshDataIfNeeded() {
    // Recargar datos si es necesario
    // this.ngOnInit(); // O el método específico para recargar
  }

  /**
   * Método simple para casos específicos (opcional)
   */
  executeSpecificAction = async (actionString: string, customData?: any) => {
    const targetCredentials = this.localData.getValue<Credentials>("Credentials_V5_V5");
    if (!targetCredentials) return null;

    return ConditionalActionBuilder
      .create(this.schema, this.exeutingActions)
      .buildFromConditions(actionString)
      .execute(targetCredentials, customData || {
        groupData: {},
        typeData: {},
        keywordsToCreate: [],
        keywordsToAssign: [],
        summary: { groupsToCreate: 0, typesToCreate: 0, keywordsToCreate: 0, keywordsToAssign: 0 }
      });
  }

  applyChanges = () => {}


}
