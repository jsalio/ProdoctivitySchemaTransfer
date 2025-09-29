import { GetDocumentGroup } from './functions/GetDocumentGroups';
import { GetDocumentTypeInGroup } from './functions/ListDocumentTypeGroups';
import { GetDocumentTypeStruct } from './functions/GetDocumentTypeStruct';
import { IStore } from '@schematransfer/core';
import { LoginToProdoctivity } from './functions/Login';
import { createDocumentGroup } from './functions/CreateDocumentGroup';

export const ProdoctivityClodStore = (): IStore => {
  return {
    login: LoginToProdoctivity,
    getDocumentGroups: GetDocumentGroup,
    getDocumentTypeInGroup: GetDocumentTypeInGroup,
    getDocumentTypeSchema: GetDocumentTypeStruct,
    getDataElements: (credential: any) => ({}) as any,
    createDocumentGroup: createDocumentGroup,
    getStoreName: () => 'Prodoctivity Cloud',
  };
};
