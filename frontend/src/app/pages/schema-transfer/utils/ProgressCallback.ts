import { StepProgress } from './StepProgress';
import { ActionProgress } from './ActionProgress';


export interface ProgressCallback {
  onStepStart?: (step: StepProgress) => void;
  onStepComplete?: (step: StepProgress) => void;
  onStepError?: (step: StepProgress) => void;
  onActionComplete?: (progress: ActionProgress) => void;
  onActionError?: (progress: ActionProgress) => void;
}
