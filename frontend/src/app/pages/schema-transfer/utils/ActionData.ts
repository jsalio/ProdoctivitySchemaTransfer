export interface ActionData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  groupData?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  typeData?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keywordsToCreate: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keywordsToAssign: any[];
  summary: {
    groupsToCreate: number;
    typesToCreate: number;
    keywordsToCreate: number;
    keywordsToAssign: number;
  };
}
