import { ProgressCallback } from './ProgressCallback';
import { ActionData } from './ActionData';
import { ActionContext } from './ActionContext';
import { Credentials } from '../../../types/models/Credentials';
import { ObservableHandler } from '../../../shared/utils/Obserbable-handler';
import { ActionProgressService } from './ActionProgress.service';
import { SchemaService } from '../../../services/backend/schema.service';

/**
 * Constructor de acciones condicionales que ejecuta pasos basados en datos
 */
export class ConditionalActionBuilder {
  private steps: Array<(credentials: Credentials, context: ActionContext, actionData: ActionData) => Promise<Partial<ActionContext>>> = [];
  private stepCodes: string[] = [];

  constructor(
    private schema: SchemaService,
    private executingActions: any,
    private progressService: ActionProgressService
  ) { }

  static create(
    schema: SchemaService,
    executingActions: any,
    progressService: ActionProgressService
  ): ConditionalActionBuilder {
    return new ConditionalActionBuilder(schema, executingActions, progressService);
  }

  /**
   * Construye la cadena de pasos basándose en el string de acciones
   */
  buildFromConditions(actionString: string): ConditionalActionBuilder {
    const actions = actionString.split('_');
    this.stepCodes = actions;

    actions.forEach(action => {
      switch (action) {
        case 'CDG':
          this.createGroup();
          break;
        case 'CDT':
          this.createDocumentType();
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
    const stepIndex = this.steps.length;
    this.steps.push(async (credentials, context, actionData) => {
      try {
        console.log('🏗️ Creating Document Group:', actionData.groupData);
        this.progressService.updateStepProgress(
          stepIndex, 
          'running', 
          'Creating document group...', 
          { groupData: actionData.groupData }
        );

        const result = await ObservableHandler.handle(
          this.schema.saveNewDocumentGroup(credentials, actionData.groupData)
        ).executeAsyncClean();

        const groupId = result.data.groupId;
        this.progressService.updateStepProgress(
          stepIndex, 
          'completed', 
          `Document group created successfully (ID: ${groupId})`, 
          { result, groupId }
        );

        return { documentGroupId: groupId };
      }
      catch (error) {
        console.error('❌ Error creating document group:', error);
        this.progressService.updateStepProgress(
          stepIndex, 
          'error', 
          'Error creating document group', 
          undefined, 
          error
        );
        throw error;
      }
    });
    return this;
  }

  private createDocumentType(): ConditionalActionBuilder {
    const stepIndex = this.steps.length;

    this.steps.push(async (credentials, context, actionData) => {

      console.log('context -> actions data:', context,actionData)
      const typeData = {
        ...actionData.typeData,
        documentGroupId: context.documentGroupId || actionData.typeData?.documentGroupId
      };

      try {
        console.log('📄 Creating Document Type:', typeData);
        this.progressService.updateStepProgress(
          stepIndex, 
          'running', 
          'Creating document type...', 
          { typeData }
        );

        const result = await ObservableHandler.handle(
          this.schema.saveNewDocumentType(credentials, typeData)
        ).executeAsyncClean();

        const typeId = result.data.documentTypeId;
        this.progressService.updateStepProgress(
          stepIndex, 
          'completed', 
          `Document type created successfully (ID: ${typeId})`, 
          { result, typeId }
        );

        console.log('✅ Document Type created:', result);
        return { documentGroupId: context.documentGroupId, documentTypeId: typeId };
      } catch (error) {
        console.error('❌ Error creating document type:', error);
        this.progressService.updateStepProgress(
          stepIndex, 
          'error', 
          `Failed to create document type: ${error.message}`, 
          null, 
          error
        );
        throw error;
      }
    });
    return this;
  }

  private createKeywords(): ConditionalActionBuilder {
    const stepIndex = this.steps.length;

    this.steps.push(async (credentials, context, actionData) => {
      const keywordCount = actionData.keywordsToCreate.length;
      
      try {
        console.log(`🏷️ Creating ${keywordCount} keywords...`);
        this.progressService.updateStepProgress(
          stepIndex, 
          'running', 
          `Creating ${keywordCount} keywords...`, 
          { keywordCount }
        );

        const createdKeywords = [];
        let usedDocumentTypeId = null;

        for (let i = 0; i < actionData.keywordsToCreate.length; i++) {
          const keywordData = actionData.keywordsToCreate[i];
          const finalKeywordData = {
            ...keywordData,
            documentTypeId: context.documentTypeId || keywordData.documentTypeId
          };

          if (!usedDocumentTypeId) {
            usedDocumentTypeId = finalKeywordData.documentTypeId;
          }

          console.log(`Creating keyword ${i + 1}/${keywordCount}: "${keywordData.name}"`);
          this.progressService.updateStepProgress(
            stepIndex, 
            'running', 
            `Creating keyword ${i + 1}/${keywordCount}: "${keywordData.name}"...`
          );

          const result = await ObservableHandler.handle(
            this.schema.saveNewKeyword(credentials, finalKeywordData)
          ).executeAsyncClean();

          createdKeywords.push({ keywordId: result.data.id, ...result.data });
        }

        this.progressService.updateStepProgress(
          stepIndex, 
          'completed', 
          `Successfully created ${keywordCount} keywords`, 
          { createdKeywords, count: keywordCount }
        );
        
        console.log('✅ Keywords created:', createdKeywords);
        return { createdKeywords, documentGroupId: context.documentGroupId, documentTypeId: context.documentTypeId || usedDocumentTypeId };
      } catch (error) {
        console.error('❌ Error creating keywords:', error);
        this.progressService.updateStepProgress(
          stepIndex, 
          'error', 
          `Failed to create keywords: ${error.message}`, 
          null, 
          error
        );
        throw error;
      }
    });
    return this;
  }

  private assignKeywords(): ConditionalActionBuilder {
    const stepIndex = this.steps.length;

    this.steps.push(async (credentials, context, actionData) => {
      const allKeywordsToAssign = [
        ...actionData.keywordsToAssign,
        ...(context.createdKeywords || []).map(k => ({
          keywordId: k.keywordId,
          documentTypeId: context.documentTypeId || actionData.keywordsToAssign[0]?.documentTypeId,
          name: k[`name`]
        }))
      ];
      debugger

      const assignCount = allKeywordsToAssign.length;

      try {
        console.log(`🔗 Assigning ${assignCount} keywords...`);
        this.progressService.updateStepProgress(
          stepIndex, 
          'running', 
          `Assigning ${assignCount} keywords...`, 
          { assignCount }
        );

        const assignedSchemas = [];

        for (let i = 0; i < allKeywordsToAssign.length; i++) {
          const assignData = allKeywordsToAssign[i];
          const finalAssignData = {
            ...assignData,
            documentTypeId: context.documentTypeId || assignData.documentTypeId
          };

          console.log(`Assigning keyword ${i + 1}/${assignCount}: "${assignData.name}"`);
          this.progressService.updateStepProgress(
            stepIndex, 
            'running', 
            `Assigning keyword ${i + 1}/${assignCount}: "${assignData.name}"...`
          );

          const result: any = await ObservableHandler.handle(
            this.schema.saveNewDocumentSchema(credentials, finalAssignData)
          ).executeAsyncClean();

          assignedSchemas.push({ schemaId: (result as any).id, ...result });
        }

        this.progressService.updateStepProgress(
          stepIndex, 
          'completed', 
          `Successfully assigned ${assignCount} keywords`, 
          { assignedSchemas, count: assignCount }
        );
        
        console.log('✅ Keywords assigned:', assignedSchemas);
        return { assignedSchemas };
      } catch (error) {
        console.error('❌ Error assigning keywords:', error);
        this.progressService.updateStepProgress(
          stepIndex, 
          'error', 
          `Failed to assign keywords: ${error.message}`, 
          null, 
          error
        );
        throw error;
      }
    });
    return this;
  }

  /**
   * Ejecuta toda la cadena de acciones
   */
  async execute(
    credentials: Credentials, 
    actionData: ActionData, 
    progressCallback?: ProgressCallback
  ): Promise<ActionContext> {
    this.executingActions.set(true);
    let context: ActionContext = {};

    try {
      console.log(`🚀 Starting conditional action chain with ${this.steps.length} steps...`);

      for (let i = 0; i < this.steps.length; i++) {
        console.log(`🔄 Step ${i + 1}/${this.steps.length}: ${this.stepCodes[i]}`);
        
        // Actualizar progreso con callbacks
        if (progressCallback) {
          const currentStep = this.progressService.getCurrentProgress()?.steps[i];
          if (currentStep) {
            this.progressService.updateStepProgress(
              i, 
              currentStep.status, 
              currentStep.message, 
              currentStep.data, 
              currentStep.error, 
              progressCallback
            );
          }
        }
        
        const result = await this.steps[i](credentials, context, actionData);
        context = { ...context, ...result };
      }

      console.log('🎉 All conditional actions completed successfully!', context);
      return context;
    } catch (error) {
      console.error('⚠️ Error executing conditional action chain:', error);
      throw error;
    } finally {
      this.executingActions.set(false);
    }
  }
}