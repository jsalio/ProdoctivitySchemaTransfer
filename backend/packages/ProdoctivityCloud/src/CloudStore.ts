import { GetDocumentGroup } from "./functions/GetDocumentGroups"
import { GetDocumentTypeInGroup } from "./functions/ListDocumentTypeGroups"
import { GetDocumentTypeStruct } from "./functions/GetDocumentTypeStruct"
import { IStore } from "@schematransfer/core"
import {LoginToProdoctivity} from "./functions/Login"

export const ProdoctivityClodStore= ():IStore => {
    return {
        login: LoginToProdoctivity,
        getDocumentGroups: GetDocumentGroup,
        getDocumentTypeInGroup:GetDocumentTypeInGroup,
        getDocumentTypeSchema:GetDocumentTypeStruct
    }
}