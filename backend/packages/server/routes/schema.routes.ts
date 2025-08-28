import Elysia from "elysia";
import { DependenceInjectionContainer } from "@schematransfer/core";
import { handleAssignDataElement } from "./handlers/handleAssignDataElement";
import { handleCreateDataElement } from "./handlers/handleCreateDataElement";
import { handleCreateDocumentGroup } from "./handlers/handleCreateDocumentGroup";
import { handleCreateDocumentType } from "./handlers/handleCreateDocumentType";
import { handleGetDataElements } from "./handlers/handleGetDataElements";
import { handleGetDocumentGroups } from "./handlers/handleGetDocumentGroups";
import { handleGetDocumentTypeSchema } from "./handlers/handleGetDocumentTypeSchema";
import { handleGetDocumentTypesGroup } from "./handlers/handleGetDocumentTypesGroup";

// Main route configuration
export const SchemaRoutes = (container: DependenceInjectionContainer) => {
    const publicRoutes = new Elysia({ prefix: '/schema' })
        .decorate('di', container)
        .post('', handleGetDocumentGroups)
        .post('group/:id', handleGetDocumentTypesGroup)
        .post('document-type/:id', handleGetDocumentTypeSchema)
        .post('data-elements', handleGetDataElements)
        .post('create-data-element', handleCreateDataElement)
        .post('create-document-group', handleCreateDocumentGroup)
        .post('create-document-type', handleCreateDocumentType)
        .post('assign-data-element', handleAssignDataElement);

    return new Elysia().use(publicRoutes);
};