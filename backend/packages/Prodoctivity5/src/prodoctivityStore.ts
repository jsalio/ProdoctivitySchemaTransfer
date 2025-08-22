import { IStore } from "@schematransfer/core"
import { LoginToProdoctivity } from "./functions/login"
import { getBusinessFunctions } from "./functions/getBusinessFunctions"
import { getDocumentTypeSchema } from "./functions/getDocumentTypeSchema"
import { getDocumentTypes } from "./functions/getDocumentTypes"

export const ProdoctivityFluencyStore= ():IStore => {
    return {
        login: LoginToProdoctivity,
        getDocumentGroups:getBusinessFunctions,
        getDocumentTypeInGroup: getDocumentTypes,
        getDocumentTypeSchema: getDocumentTypeSchema,
        getStoreName:()=> "Prodoctivity Fluency"
    }
}