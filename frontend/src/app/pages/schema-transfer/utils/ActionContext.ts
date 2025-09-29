export interface ActionContext {
  documentGroupId?: string;
  documentTypeId?: string;
  createdKeywords?: { keywordId: string; [key: string]: Value }[];
  assignedSchemas?: { schemaId: string; [key: string]: Value }[];
}

export type Value = string | number | Date | boolean | object;
