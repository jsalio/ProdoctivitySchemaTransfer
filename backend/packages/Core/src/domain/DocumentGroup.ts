export type DocumentGroup = {
    groupId: string,
    groupName: string,
    documentTypesCounter: number
}

export interface DocumentType {
    documentTypeId: string,
    documentTypeName: string,
}

export interface SchemaDocumentType{
    name: string
    documentTypeId: string
    keywords: {
        name: string
        label: string,
        dataType: string,
        require: boolean
    }
}