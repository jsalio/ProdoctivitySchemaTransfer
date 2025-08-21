import { IStore } from "@schematransfer/core"
import { LoginToProdoctivity } from "./functions/login"
import { getBusinessFunctions } from "./functions/getBusinessFunctions"
import { getDocumentTypes } from "./functions/getDocumentTypes"

export const ProdoctivityFluencyStore= ():IStore => {
    return {
        login: LoginToProdoctivity,
        getDocumentGroups:getBusinessFunctions,
        getDocumentTypeInGroup: getDocumentTypes,
        getDocumentTypeSchema: () => {return {} as any},
        getStoreName:()=> "Prodoctivity Fluency"
    }
}