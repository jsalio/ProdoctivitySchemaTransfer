import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActionProgress } from './ActionProgress';
import { StepProgress } from './StepProgress';
import { ProgressCallback } from './ProgressCallback';
import { ActionStringBuilder } from './ActionStringBuilder';
import { Value } from './ActionContext';

@Injectable({
  providedIn: 'root',
})
export class ActionProgressService {
  private progressSubject = new BehaviorSubject<ActionProgress | null>(null);
  public progress$ = this.progressSubject.asObservable();

  private currentProgress: ActionProgress | null = null;

  constructor() {
    // Debug subscription para verificar que se emiten los datos
    this.progress$.subscribe((progress) => {
      console.log('🔄 Progress Service - New progress:', progress);
    });
  }

  /**
   * Inicializa el progreso para una nueva acción
   */
  initializeProgress(actionString: string): void {
    const steps = this.createStepsFromActionString(actionString);

    this.currentProgress = {
      actionString,
      description: ActionStringBuilder.getDescription(actionString),
      currentStep: 0,
      totalSteps: steps.length,
      steps,
      status: 'initializing',
      startTime: new Date(),
    };

    console.log('🚀 Progress Service - Initializing progress:', this.currentProgress);
    this.progressSubject.next(this.currentProgress);
  }

  /**
   * Actualiza el progreso de un paso específico
   */
  updateStepProgress(
    stepIndex: number,
    status: StepProgress['status'],
    message: string,
    data?: Value,
    error?: Value,
    progressCallback?: ProgressCallback,
  ): void {
    if (!this.currentProgress) {
      console.warn('⚠️ No current progress to update');
      return;
    }

    const step = this.currentProgress.steps[stepIndex];
    if (!step) {
      console.warn(`⚠️ Step ${stepIndex} not found`);
      return;
    }

    // Actualizar el paso
    step.status = status;
    step.message = message;
    step.timestamp = new Date();
    if (data !== undefined) step.data = data;
    if (error !== undefined) step.error = error;

    // Actualizar progreso general
    this.currentProgress.currentStep = status === 'completed' ? stepIndex + 1 : stepIndex;

    // Actualizar estado general basado en el progreso de los pasos
    if (status === 'error') {
      this.currentProgress.status = 'error';
      this.currentProgress.endTime = new Date();
    } else if (this.currentProgress.currentStep >= this.currentProgress.totalSteps) {
      this.currentProgress.status = 'completed';
      this.currentProgress.endTime = new Date();
    } else {
      this.currentProgress.status = 'running';
    }

    console.log(
      `📊 Progress Service - Step ${stepIndex + 1}/${this.currentProgress.totalSteps}: ${status} - ${message}`,
    );

    // Emitir el progreso actualizado
    this.progressSubject.next({ ...this.currentProgress });

    // Llamar callbacks si se proporcionan
    this.triggerCallbacks(step, this.currentProgress, progressCallback);
  }

  /**
   * Marca el progreso como completado
   */
  completeProgress(): void {
    if (!this.currentProgress) return;

    this.currentProgress.status = 'completed';
    this.currentProgress.endTime = new Date();
    this.currentProgress.currentStep = this.currentProgress.totalSteps;

    console.log('✅ Progress Service - Action completed');
    this.progressSubject.next({ ...this.currentProgress });
  }

  /**
   * Marca el progreso como fallido
   */
  failProgress(error: Error): void {
    if (!this.currentProgress) return;

    this.currentProgress.status = 'error';
    this.currentProgress.endTime = new Date();

    console.log('❌ Progress Service - Action failed:', error);
    this.progressSubject.next({ ...this.currentProgress });
  }

  /**
   * Limpia el progreso actual
   */
  clearProgress(): void {
    console.log('🧹 Progress Service - Clearing progress');
    this.currentProgress = null;
    this.progressSubject.next(null);
  }

  /**
   * Obtiene el progreso actual
   */
  getCurrentProgress(): ActionProgress | null {
    return this.currentProgress;
  }

  /**
   * Crea los pasos iniciales basados en el string de acciones
   */
  private createStepsFromActionString(actionString: string): StepProgress[] {
    const actions = actionString.split('_');
    const stepDescriptions = {
      CDG: 'Create Document Group',
      CDT: 'Create Document Type',
      CDK: 'Create Keywords',
      ADK: 'Assign Keywords',
    };

    return actions.map((action, index) => ({
      stepName: stepDescriptions[action] || action,
      stepCode: action,
      status: 'pending' as const,
      message: 'Waiting to start...',
      timestamp: new Date(),
      stepIndex: index,
      totalSteps: actions.length,
    }));
  }

  /**
   * Dispara los callbacks apropiados
   */
  private triggerCallbacks(
    step: StepProgress,
    progress: ActionProgress,
    progressCallback?: ProgressCallback,
  ): void {
    if (!progressCallback) return;

    switch (step.status) {
      case 'running':
        progressCallback.onStepStart?.(step);
        break;
      case 'completed':
        progressCallback.onStepComplete?.(step);
        if (progress.status === 'completed') {
          progressCallback.onActionComplete?.(progress);
        }
        break;
      case 'error':
        progressCallback.onStepError?.(step);
        if (progress.status === 'error') {
          progressCallback.onActionError?.(progress);
        }
        break;
    }
  }
}
