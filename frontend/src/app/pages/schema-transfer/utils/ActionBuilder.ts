// eslint-disable
import { WritableSignal } from '@angular/core';
import { Credentials } from '../../../types/models/Credentials';
import { DocumetTypeKeyword } from '../../../types/models/DocumentTypeKeywordSchema';
import { SchemaDocumentGroup } from '../../../types/models/SchemaDocumentGroup';
import { SchemaDocumentType } from '../../../types/DocumentType';
import { SchemaService } from '../../../services/backend/schema.service';
import { TranferResumeService } from '../../../services/ui/tranfer-resume.service';
import { ConditionalActionBuilder } from './ConditionalActionBuilder';
import { ActionStringBuilder } from './ActionStringBuilder';
import { ActionContext } from './ActionContext';
import { ActionData } from './ActionData';
import { ActionConditions } from './ActionConditions';
import { ProgressCallback } from './ProgressCallback';
import { ActionProgressService } from './ActionProgress.service';

/**
 * Orquestador principal que analiza condiciones y ejecuta acciones
 */
export class ActionOrchestrator {
  constructor(
    private schema: SchemaService,
    private executingActions: WritableSignal<boolean>,
    private resumeService: TranferResumeService,
    private progressService: ActionProgressService,
  ) {
    // Suscribirse al progreso para debug
    this.progressService.progress$.subscribe((progress) => {
      console.log('🎭 Orchestrator - Progress update:', progress);
    });
  }

  /**
   * Observable del progreso que puede ser usado por componentes externos
   */
  get progress$() {
    return this.progressService.progress$;
  }

  /**
   * Analiza las condiciones y ejecuta las acciones necesarias
   */
  async executeActionsFromConditions(
    credentials: Credentials,
    selectedKeywords: DocumetTypeKeyword[],
    selectedGroup: SchemaDocumentGroup,
    selectedDocumentType: SchemaDocumentType,
    DRY = false,
    progressCallback?: ProgressCallback,
  ): Promise<ActionContext> {
    try {
      // 1. Analizar condiciones
      const conditions = this.analyzeConditions(
        selectedKeywords,
        selectedGroup,
        selectedDocumentType,
      );

      // 2. Construir string de acciones
      const actionString = ActionStringBuilder.build(conditions);

      if (!actionString) {
        console.log('ℹ️ No actions needed');
        return {};
      }

      // 3. Inicializar progreso
      this.progressService.initializeProgress(actionString);

      // 4. Preparar datos para las acciones
      const actionData = this.prepareActionData(
        selectedKeywords,
        selectedGroup,
        selectedDocumentType,
        conditions,
      );

      console.log(`🎯 Executing action plan: ${actionString}`);
      console.log('📊 Action summary:', actionData.summary);

      if (DRY) {
        console.log('🧪 DRY run, not executing actions');
        this.resumeService.emitResume(actionData);
        this.progressService.clearProgress();
        return {};
      }

      // 5. Ejecutar acciones
      const result = await ConditionalActionBuilder.create(
        this.schema,
        this.executingActions,
        this.progressService,
      )
        .buildFromConditions(actionString)
        .execute(credentials, actionData, progressCallback);

      console.log('🏆 Action execution completed:', result);
      this.progressService.completeProgress();

      return result;
    } catch (error) {
      console.error('💥 Error in action orchestrator:', error);
      this.progressService.failProgress(error);
      throw error;
    }
  }

  /**
   * Analiza las condiciones actuales del sistema
   */
  private analyzeConditions(
    selectedKeywords: DocumetTypeKeyword[],
    selectedGroup: SchemaDocumentGroup,
    selectedDocumentType: SchemaDocumentType,
  ): ActionConditions {
    const keywordForCreateAndAssign = selectedKeywords.filter(
      (x) => !x.isSync && !x.presentInTarget,
    );
    const keywordForOnlyAssign = selectedKeywords.filter((x) => !x.isSync && x.presentInTarget);
    const requiredCreateDocumentType =
      selectedDocumentType?.targetDocumentType === null ||
      selectedDocumentType?.targetDocumentType === '';
    const requiredCreatedDocumentGroup =
      selectedGroup?.targetId === null || selectedGroup?.targetId === '';

    const conditions: ActionConditions = {
      needsGroup: requiredCreatedDocumentGroup,
      needsType: requiredCreateDocumentType,
      needsCreateKeywords: keywordForCreateAndAssign.length > 0,
      needsAssignKeywords: keywordForOnlyAssign.length > 0 || keywordForCreateAndAssign.length > 0,
    };

    console.log('🔍 Analyzed conditions:', conditions);
    return conditions;
  }

  /**
   * Prepara todos los datos necesarios para las acciones
   */
  private prepareActionData(
    selectedKeywords: DocumetTypeKeyword[],
    selectedGroup: SchemaDocumentGroup,
    selectedDocumentType: SchemaDocumentType,
    conditions: ActionConditions,
  ): ActionData {
    const keywordForCreateAndAssign = selectedKeywords.filter(
      (x) => !x.isSync && !x.presentInTarget,
    );
    const keywordForOnlyAssign = selectedKeywords.filter((x) => !x.isSync && x.presentInTarget);

    const actionData: ActionData = {
      groupData: conditions.needsGroup
        ? {
            name: selectedGroup.groupName,
          }
        : undefined,

      typeData: conditions.needsType
        ? {
            name: selectedDocumentType.documentTypeName,
            documentGroupId: selectedGroup.targetId,
          }
        : undefined,

      keywordsToCreate: keywordForCreateAndAssign.map((x) => ({
        documentTypeId: selectedDocumentType.targetDocumentType,
        name: x.name,
        dataType: x.dataType,
        require: x.require,
        label: x.label,
      })),

      keywordsToAssign: keywordForOnlyAssign.map((x) => ({
        documentTypeId: selectedDocumentType.targetDocumentType,
        keywordId: x.targetKeywordId,
        name: x.name,
      })),

      summary: {
        groupsToCreate: conditions.needsGroup ? 1 : 0,
        typesToCreate: conditions.needsType ? 1 : 0,
        keywordsToCreate: keywordForCreateAndAssign.length,
        keywordsToAssign: keywordForOnlyAssign.length,
      },
    };

    console.log('📋 Prepared action data:', actionData);
    return actionData;
  }
}
