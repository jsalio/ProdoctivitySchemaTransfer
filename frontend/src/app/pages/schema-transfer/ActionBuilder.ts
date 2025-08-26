import { signal, WritableSignal } from '@angular/core';
import { ObservableHandler } from '../../shared/utils/Obserbable-handler';
import { Credentials } from '../../types/models/Credentials';
import { DocumetTypeKeyword } from '../../types/models/DocumentTypeKeywordSchema';
import { SchemaDocumentGroup } from './group-list/group-list.component';
import { SchemaDocumentType } from './document-types-list/document-types-list.component';
import { SchemaService } from '../../services/backend/schema.service';
import { TranferResumeService } from '../../services/ui/tranfer-resume.service';

export interface ActionConditions {
  needsGroup: boolean;
  needsType: boolean;
  needsCreateKeywords: boolean;
  needsAssignKeywords: boolean;
}

export interface ActionData {
  groupData?: any;
  typeData?: any;
  keywordsToCreate: any[];
  keywordsToAssign: any[];
  summary: {
    groupsToCreate: number;
    typesToCreate: number;
    keywordsToCreate: number;
    keywordsToAssign: number;
  };
}

export interface ActionContext {
  documentGroupId?: string;
  documentTypeId?: string;
  createdKeywords?: Array<{ keywordId: string; [key: string]: any }>;
  assignedSchemas?: Array<{ schemaId: string; [key: string]: any }>;
}

/**
 * Orquestador principal que analiza condiciones y ejecuta acciones
 */
export class ActionOrchestrator {
  constructor(
    private schema: SchemaService,
    private executingActions: WritableSignal<boolean>,
    private resumeService: TranferResumeService
  ) {}

  /**
   * Analiza las condiciones y ejecuta las acciones necesarias
   */
  async executeActionsFromConditions(
    credentials: Credentials,
    selectedKeywords: DocumetTypeKeyword[],
    selectedGroup: SchemaDocumentGroup,
    selectedDocumentType: SchemaDocumentType,
    DRY: boolean = false
  ): Promise<ActionContext> {
    
    // 1. Analizar condiciones
    const conditions = this.analyzeConditions(selectedKeywords, selectedGroup, selectedDocumentType);
    
    // 2. Construir string de acciones
    const actionString = ActionStringBuilder.build(conditions);
    
    if (!actionString) {
      console.log('ℹ️ No actions needed');
      return {};
    }
    
    // 3. Preparar datos para las acciones
    const actionData = this.prepareActionData(selectedKeywords, selectedGroup, selectedDocumentType, conditions);
    
    // 4. Ejecutar acciones
    console.log(`🎯 Executing action plan: ${actionString}`);
    console.log('📊 Action summary:', actionData.summary);
    
    if (DRY) {
      console.log('DRY run, not executing actions');
      this.resumeService.emitResume(actionData);
      return {};
    }

    const result = await ConditionalActionBuilder
      .create(this.schema, this.executingActions)
      .buildFromConditions(actionString)
      .execute(credentials, actionData);

    console.log('🏆 Action execution completed:', result);
    return result;
  }

  /**
   * Analiza las condiciones actuales del sistema
   */
  private analyzeConditions(
    selectedKeywords: DocumetTypeKeyword[],
    selectedGroup: SchemaDocumentGroup,
    selectedDocumentType: SchemaDocumentType
  ): ActionConditions {
    
    const keywordForCreateAndAssign = selectedKeywords.filter(x => !x.isSync && !x.presentInTarget);
    const keywordForOnlyAssign = selectedKeywords.filter(x => !x.isSync && x.presentInTarget);
    const requiredCreateDocumentType = selectedDocumentType?.targetDocumentType === null || selectedDocumentType?.targetDocumentType === "";
    const requiredCreatedDocumentGroup = selectedGroup?.targetId === null || selectedGroup?.targetId === "";

    const conditions: ActionConditions = {
      needsGroup: requiredCreatedDocumentGroup,
      needsType: requiredCreateDocumentType,
      needsCreateKeywords: keywordForCreateAndAssign.length > 0,
      needsAssignKeywords: keywordForOnlyAssign.length > 0 || keywordForCreateAndAssign.length > 0
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
    conditions: ActionConditions
  ): ActionData {
    
    const keywordForCreateAndAssign = selectedKeywords.filter(x => !x.isSync && !x.presentInTarget);
    const keywordForOnlyAssign = selectedKeywords.filter(x => !x.isSync && x.presentInTarget);

    const actionData: ActionData = {
      groupData: conditions.needsGroup ? {
        name: selectedGroup.groupName,
      } : undefined,

      typeData: conditions.needsType ? {
        name: selectedDocumentType.documentTypeName,
        documentGroupId: selectedGroup.targetId,
      } : undefined,

      keywordsToCreate: keywordForCreateAndAssign.map(x => ({
        documentTypeId: selectedDocumentType.targetDocumentType,
        name: x.name,
        dataType: x.dataType,
        require: x.require,
        label: x.label,
      })),

      keywordsToAssign: keywordForOnlyAssign.map(x => ({
        documentTypeId: selectedDocumentType.targetDocumentType,
        keywordId: x.targetKeywordId,
        name: x.name,
      })),

      summary: {
        groupsToCreate: conditions.needsGroup ? 1 : 0,
        typesToCreate: conditions.needsType ? 1 : 0,
        keywordsToCreate: keywordForCreateAndAssign.length,
        keywordsToAssign: keywordForOnlyAssign.length
      }
    };

    console.log('📋 Prepared action data:', actionData);
    return actionData;
  }
}

/**
 * Constructor de strings de acciones basado en condiciones
 */
export class ActionStringBuilder {
  /**
   * Construye dinámicamente el string de acciones basado en las condiciones
   */
  static build(conditions: ActionConditions): string | null {
    const actions: string[] = [];

    if (conditions.needsGroup) {
      actions.push('CDG'); // Create Document Group
    }
    
    if (conditions.needsType) {
      actions.push('CDT'); // Create Document Type
    }
    
    if (conditions.needsCreateKeywords) {
      actions.push('CDK'); // Create Document Keyword
    }
    
    if (conditions.needsAssignKeywords) {
      actions.push('ADK'); // Assign Document Keywords
    }

    if (actions.length === 0) {
      return null;
    }

    const actionString = actions.join('_');
    console.log(`🔧 Built action string: ${actionString} (${this.getDescription(actionString)})`);
    return actionString;
  }

  /**
   * Obtiene una descripción legible del string de acciones
   */
  static getDescription(actionString: string): string {
    const descriptions = {
      'CDG': 'Create Group',
      'CDT': 'Create Type', 
      'CDK': 'Create Keywords',
      'ADK': 'Assign Keywords'
    };

    return actionString
      .split('_')
      .map(action => descriptions[action] || action)
      .join(' → ');
  }
}

/**
 * Constructor de acciones condicionales que ejecuta pasos basados en datos
 */
export class ConditionalActionBuilder {
  private steps: Array<(credentials: Credentials, context: ActionContext, actionData: ActionData) => Promise<Partial<ActionContext>>> = [];

  constructor(
    private schema: any,
    private executingActions: any
  ) {}

  static create(schema: any, executingActions: any): ConditionalActionBuilder {
    return new ConditionalActionBuilder(schema, executingActions);
  }

  /**
   * Construye la cadena de pasos basándose en el string de acciones
   */
  buildFromConditions(actionString: string): ConditionalActionBuilder {
    const actions = actionString.split('_');
    
    actions.forEach(action => {
      switch (action) {
        case 'CDG':
          this.createGroup();
          break;
        case 'CDT':
          this.createType();
          break;
        case 'CDK':
          this.createKeywords();
          break;
        case 'ADK':
          this.assignKeywords();
          break;
        default:
          console.warn(`⚠️ Unknown action: ${action}`);
      }
    });

    return this;
  }

  private createGroup(): ConditionalActionBuilder {
    this.steps.push(async (credentials, context, actionData) => {
      console.log('🏗️ Creating Document Group:', actionData.groupData);
      
      const result = await ObservableHandler.handle(
        this.schema.saveNewDocumentGroup(credentials, actionData.groupData)
      ).executeAsyncClean();
      
      console.log('✅ Document Group created:', result);
      return { documentGroupId: (result as any).id };
    });
    return this;
  }

  private createType(): ConditionalActionBuilder {
    this.steps.push(async (credentials, context, actionData) => {
      console.log('📄 Creating Document Type:', actionData.typeData);
      
      // Usar el grupo recién creado si está disponible
      const typeData = {
        ...actionData.typeData,
        documentGroupId: context.documentGroupId || actionData.typeData?.documentGroupId
      };
      
      const result = await ObservableHandler.handle(
        this.schema.saveNewDocumentType(credentials, typeData)
      ).executeAsyncClean();
      
      console.log('✅ Document Type created:', result);
      return { documentTypeId: (result as any).id };
    });
    return this;
  }

  private createKeywords(): ConditionalActionBuilder {
    this.steps.push(async (credentials, context, actionData) => {
      console.log('🏷️ Creating Keywords:', actionData.keywordsToCreate);
      const createdKeywords = [];

      for (const keywordData of actionData.keywordsToCreate) {
        // Usar el tipo de documento recién creado si está disponible
        const finalKeywordData = {
          ...keywordData,
          documentTypeId: context.documentTypeId || keywordData.documentTypeId
        };

        const result:any = await ObservableHandler.handle(
          this.schema.saveNewKeyword(credentials, finalKeywordData)
        ).executeAsyncClean();
        
        console.log('✅ Keyword created:', result);
        createdKeywords.push({ keywordId: (result as any).id, ...result });
      }

      return { createdKeywords };
    });
    return this;
  }

  private assignKeywords(): ConditionalActionBuilder {
    this.steps.push(async (credentials, context, actionData) => {
      console.log('🔗 Assigning Keywords...');
      const assignedSchemas = [];

      // Combinar keywords creadas y existentes
      const allKeywordsToAssign = [
        ...actionData.keywordsToAssign,
        ...(context.createdKeywords || []).map(k => ({
          keywordId: k.keywordId,
          documentTypeId: context.documentTypeId || actionData.keywordsToAssign[0]?.documentTypeId,
          name: k[`${name}`]
        }))
      ];

      for (const assignData of allKeywordsToAssign) {
        const finalAssignData = {
          ...assignData,
          documentTypeId: context.documentTypeId || assignData.documentTypeId
        };

        const result:any = await ObservableHandler.handle(
          this.schema.saveNewDocumentSchema(credentials, finalAssignData)
        ).executeAsyncClean();
        
        console.log('✅ Keyword assigned:', result);
        assignedSchemas.push({ schemaId: (result as any).id, ...result });
      }

      return { assignedSchemas };
    });
    return this;
  }

  /**
   * Ejecuta toda la cadena de acciones
   */
  async execute(credentials: Credentials, actionData: ActionData): Promise<ActionContext> {
    this.executingActions.set(true);
    let context: ActionContext = {};

    try {
      console.log(`🚀 Starting conditional action chain with ${this.steps.length} steps...`);
      
      for (let i = 0; i < this.steps.length; i++) {
        console.log(`📍 Step ${i + 1}/${this.steps.length}`);
        const result = await this.steps[i](credentials, context, actionData);
        context = { ...context, ...result };
      }
      
      console.log('🎉 All conditional actions completed successfully!', context);
      return context;
    } catch (error) {
      console.error('❌ Error executing conditional action chain:', error);
      throw error;
    } finally {
      this.executingActions.set(false);
    }
  }
}