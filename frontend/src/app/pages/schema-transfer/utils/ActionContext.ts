export interface ActionContext {
  documentGroupId?: string;
  documentTypeId?: string;
  createdKeywords?: Array<{ keywordId: string; [key: string]: any }>;
  assignedSchemas?: Array<{ schemaId: string; [key: string]: any }>;
}
