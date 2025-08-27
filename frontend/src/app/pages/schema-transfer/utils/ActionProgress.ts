import { StepProgress } from './StepProgress';


export interface ActionProgress {
  actionString: string;
  description: string;
  currentStep: number;
  totalSteps: number;
  steps: StepProgress[];
  status: 'initializing' | 'running' | 'completed' | 'error';
  startTime: Date;
  endTime?: Date;
}
