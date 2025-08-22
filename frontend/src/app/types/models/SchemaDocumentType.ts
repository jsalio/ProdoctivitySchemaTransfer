
export interface SchemaDocumentType {
    name: string;
    documentTypeId: string;
    keywords: {
        name: string;
        label: string;
        dataType: string;
        require: boolean;
    }[];
}
