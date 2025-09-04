import { IStore } from '@schematransfer/core';
import { LoginToProdoctivity } from './functions/login';
import { getBusinessFunctions } from './functions/getBusinessFunctions';
import { getDataElements } from './functions/getDataElements';
import { getDocumentTypeSchema } from './functions/getDocumentTypeSchema';
import { getDocumentTypes } from './functions/getDocumentTypes';
import { createDocumentGroup } from './functions/createDocumentGroup';
import { createDocumentType } from './functions/createDocumentType';
import { createKeyword } from './functions/createDataElement';
import { assignKeywordToDoc } from './functions/assignKeywordToDoc';
/**
 * This function returns an implementation of the IStore interface for Prodoctivity Fluency
 * @returns an implementation of the IStore interface for Prodoctivity Fluency
 */
export const ProdoctivityFluencyStore = (): IStore => {
  return {
    login: LoginToProdoctivity,
    getDocumentGroups: getBusinessFunctions,
    getDocumentTypeInGroup: getDocumentTypes,
    getDocumentTypeSchema: getDocumentTypeSchema,
    getDataElements: getDataElements,
    createDocumentGroup: createDocumentGroup,
    createDocumentType: createDocumentType,
    createDataElement: createKeyword,
    assignDataElementToDocumentType: assignKeywordToDoc,
    getStoreName: () => 'Prodoctivity Fluency',
  };
};
