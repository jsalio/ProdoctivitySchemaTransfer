import { CultureAssociation } from "./CultureAssociation";


export interface OutputFormat {
  cultureAssociations: CultureAssociation[];
  format: string;
  dataType: string;
  description: string;
}
