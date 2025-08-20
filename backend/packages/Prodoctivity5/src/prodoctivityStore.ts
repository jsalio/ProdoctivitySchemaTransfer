// import { GetDocumentGroup } from "./functions/GetDocumentGroups"
// import { GetDocumentTypeInGroup } from "./functions/ListDocumentTypeGroups"
// import { GetDocumentTypeStruct } from "./functions/GetDocumentTypeStruct"
import { IStore } from "@schematransfer/core"
import { LoginToProdoctivity } from "./functions/login"
// import {LoginToProdoctivity} from "./functions/Login"

export const ProdoctivityFluencyStore= ():IStore => {
    return {
        login: LoginToProdoctivity,
        getDocumentGroups:  () => {return {} as any},
        getDocumentTypeInGroup: () => {return {} as any},
        getDocumentTypeSchema: () => {return {} as any}
    }
}