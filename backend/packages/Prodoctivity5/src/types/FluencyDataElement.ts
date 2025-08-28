import { Input } from "./Input";
import { Output } from "./Output";

export interface FluencyDataElement {
  id: number;
  name: string;
  dataType: string;
  required: boolean;
  sampleValue: string;
  unique: boolean;
  defaultValue: string;
  question: string;
  instructions: string;
  definition: string;
  cultureLanguageName: string;
  topicName: string;
  isReferenceField: boolean;
  isSystemDate: boolean;
  is12Hour: boolean;
  notVisibleOnDocument: boolean;
  readOnly: boolean;
  autocomplete: boolean;
  alternativeQuestions: string[];
  input: Input;
  output: Output;
  sequenceId: number;
  oldSequenceId: number;
}


