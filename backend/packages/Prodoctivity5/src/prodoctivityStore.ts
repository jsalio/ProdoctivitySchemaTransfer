import { IStore } from "@schematransfer/core"
import { LoginToProdoctivity } from "./functions/login"
import { getBusinessFunctions } from "./functions/getBusinessFunctions"
import { getDataElements } from "./functions/getDataElements"
import { getDocumentTypeSchema } from "./functions/getDocumentTypeSchema"
import { getDocumentTypes } from "./functions/getDocumentTypes"

export const ProdoctivityFluencyStore= ():IStore => {
    return {
        login: LoginToProdoctivity,
        getDocumentGroups:getBusinessFunctions,
        getDocumentTypeInGroup: getDocumentTypes,
        getDocumentTypeSchema: getDocumentTypeSchema,
        getDataElements:getDataElements,
        getStoreName:()=> "Prodoctivity Fluency"
    }
}