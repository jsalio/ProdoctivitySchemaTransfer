
export interface StepProgress {
  stepName: string;
  stepCode: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  message: string;
  data?: any;
  error?: any;
  timestamp: Date;
  stepIndex: number;
  totalSteps: number;
}
