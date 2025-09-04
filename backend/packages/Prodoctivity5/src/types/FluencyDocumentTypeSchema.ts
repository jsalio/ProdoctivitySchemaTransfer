export type FluencyDocumentTypeSchema = {
  id: number;
  name: string;
  businessLine: {
    id: number;
    name: string;
  };
  keywords: {
    name: string;
    humanName: string;
    definition: {
      humanName: string;
      properties: {
        name: string;
        dataType: string;
      };
    };
  }[];
};
