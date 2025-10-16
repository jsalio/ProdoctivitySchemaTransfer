/**
 * Represents a group of document types for classification and mapping.
 */
export interface SchemaDocumentGroup {
  /** Unique identifier of the group */
  groupId: string;
  /** Display name of the group */
  groupName: string;
  /** Number of document types associated to the group */
  documentTypesCounter: number;
  /** Identifier of the corresponding target group, if mapped */
  targetId: string | null;
}
