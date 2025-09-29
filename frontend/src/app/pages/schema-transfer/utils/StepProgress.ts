export interface StepProgress {
  stepName: string;
  stepCode: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  message: string;
  data?: unknown;
  error?: Error | unknown;
  timestamp: Date;
  stepIndex: number;
  totalSteps: number;
}
