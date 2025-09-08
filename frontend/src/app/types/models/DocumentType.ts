export interface DocumentType {
  documentTypeId: string;
  documentTypeName: string;
}

export interface SchemaDocumentType {
  documentTypeId: string;
  documentTypeName: string;
  targetDocumentType: string; // ✅ Corregido el typo
}
