
export interface DocumentTypeKeywordSchema {
    name: string;
    documentTypeId: string;
    keywords: Array<DocumetTypeKeyword>
};

export interface DocumetTypeKeyword {
    name: string;
    label: string;
    dataType: string;
    require: boolean;
    isSync: boolean; 
    presentInTarget:boolean
}
