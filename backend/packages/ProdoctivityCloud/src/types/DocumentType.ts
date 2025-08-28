import { ContextDefinition } from "./ContextDefinition";
import { MySubscriptions } from "./MySubscriptions";
import { NameConfig } from "./NameConfig";
import { Permission } from "./Permission";
import { WizardDefinition } from "./WizardDefinition";

/**
 * Represents a document type definition in the Prodoctivity system.
 * This interface defines the structure and behavior of a specific type of document,
 * including its metadata, permissions, and configuration.
 */
export interface DocumentType {
  /** Array of MIME types that are accepted for this document type */
  acceptedMimeTypes: string[];
  
  /** Whether to automatically extract metadata from the document */
  autoExtract: boolean;
  
  /** Unique identifier for the document type */
  documentTypeId: string;
  
  /** Version identifier for the document type */
  documentTypeVersionId: string;
  
  /** Human-readable name of the document type */
  name: string;
  
  /** Contextual information and settings for the document type */
  contextDefinition: ContextDefinition;
  
  /** Configuration for the document creation/editing wizard */
  wizardDefinition: WizardDefinition;
  
  /** Mappings for data linking functionality */
  dataLinkMappings: any[]; // TODO: Replace 'any' with proper type
  
  /** Mappings for document distribution */
  distributionMappings: any[]; // TODO: Replace 'any' with proper type
  
  /** User's subscription settings for this document type */
  mySubscriptions: MySubscriptions;
  
  /** List of permissions associated with this document type */
  permissions: Permission[];
  
  /** Configuration for document naming conventions */
  nameConfig: NameConfig[];
  
  /** Configuration for document identifiers */
  identifierConfig: any[]; // TODO: Replace 'any' with proper type
  
  /** Whether identifier collisions should force creation of a new version */
  identifierCollisionForcesNewVersion: boolean;
  
  /** Number of days before expiration to show warning */
  expirationWarningDays: number;
  
  /** Whether full-text indexing is enabled for this document type */
  useFullTextIndex: boolean;
  
  /** Name of the document group this type belongs to */
  documentGroupName: string;
  
  /** Unique identifier of the document group */
  documentGroupId: string;
  
  /** Whether this document type originates from a content library */
  isFromContentLibrary: boolean;
  
  /** Author/creator of the document type */
  author: string;
  
  /** Whether the document type is published and available for use */
  isPublished: boolean;
  
  /** Whether this document type has an associated data link definition */
  hasDataLinkDefinition: boolean;
}
