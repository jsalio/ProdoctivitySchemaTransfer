import { OutputFormat } from "./OutputFormat";


export interface Output {
  conditionalStyles: any[];
  outputFormat: OutputFormat;
  dataElementOrderType: string;
  dataElementListSeparator: string;
  dataElementPenultimateSeparator: string;
  dataElementFinalizer: string;
}
