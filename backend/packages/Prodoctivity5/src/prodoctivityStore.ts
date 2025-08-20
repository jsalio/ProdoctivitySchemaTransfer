import { IStore } from "@schematransfer/core"
import { LoginToProdoctivity } from "./functions/login"
import { getBusinessFunctions } from "./functions/getBusinessFunctions"

export const ProdoctivityFluencyStore= ():IStore => {
    return {
        login: LoginToProdoctivity,
        getDocumentGroups:getBusinessFunctions,
        getDocumentTypeInGroup: () => {return {} as any},
        getDocumentTypeSchema: () => {return {} as any},
        getStoreName:()=> "Prodoctivity Fluency"
    }
}