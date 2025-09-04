export interface ActionData {
  groupData?: any;
  typeData?: any;
  keywordsToCreate: any[];
  keywordsToAssign: any[];
  summary: {
    groupsToCreate: number;
    typesToCreate: number;
    keywordsToCreate: number;
    keywordsToAssign: number;
  };
}
