import {
    AppCodeError,
    AssignDataElement,
    AssignDataElementToDocumentRequest,
    CoreResult,
    CreateDataElement,
    CreateDocumentGroup,
    CreateDocumentGroupRequest,
    CreateDocumentType,
    Credentials,
    DataElement,
    DocumentGroup,
    DocumentType,
    GetAllDataElemets,
    GetDocumentGroupRequest,
    GetDocumentGroups,
    GetDocumentTypeSchema,
    GetDocumentTypeSchemaRequest,
    GetDocumentTypesGroups,
    IStore,
    SchemaDocumentType,
    ValidationError
} from "@schematransfer/core";

import { CreateDataElementRequest } from "packages/Core/src/domain/Create-data-element-request";
import { CreateDocumentTypeRequest } from "packages/Core/src/domain/Create-document-type-request";
import { BaseService } from "./BaseService";

type UseCase<T = any> = {
    validate(): ValidationError<Credentials>[];
    execute(): Promise<CoreResult<T, AppCodeError, Error>>;
};

export class SchemaService extends BaseService {
    constructor(private readonly store: IStore) {
        super();
    }

    /**
     * Ejecuta un caso de uso con manejo de errores estandarizado
     */
    private async executeUseCase<T>(useCase: UseCase<T>): Promise<CoreResult<T, AppCodeError, Error>> {
        try {
            const validationError = this.checkValidation(useCase.validate());
            if (validationError !== "") {
                return this.createValidationError(validationError);
            }
            return await useCase.execute();
        } catch (err) {
            return this.createUnmanagedError(err as Error);
        }
    }

    private createValidationError(error: string): CoreResult<never, AppCodeError, Error> {
        return {
            ok: false,
            code: AppCodeError.ValidationsFailed,
            error: new Error(error)
        };
    }

    private createUnmanagedError(err: Error): CoreResult<never, AppCodeError, Error> {
        return {
            ok: false,
            code: AppCodeError.UnmanagedError,
            error: new Error(err.message)
        };
    }

    async getListOfDocumentGroups(credentials: Credentials): Promise<CoreResult<Array<DocumentGroup>, AppCodeError, Error>> {
        console.log(this.store.getStoreName());
        const request = this.buildRequest<Credentials>(credentials);
        const useCase = new GetDocumentGroups(request, this.store);
        return this.executeUseCase(useCase);
    }

    async getListDocumentTypesGroup(
        credentials: Credentials, 
        groupId: string
    ): Promise<CoreResult<DocumentType[], AppCodeError, Error>> {
        const request = this.buildRequest<GetDocumentGroupRequest>({ credentials, groupId });
        const useCase = new GetDocumentTypesGroups(request, this.store);
        return this.executeUseCase(useCase);
    }

    async getDocumentTypeSchema(
        credentials: Credentials, 
        documentTypeId: string
    ): Promise<CoreResult<SchemaDocumentType, AppCodeError, Error>> {
        const request = this.buildRequest<GetDocumentTypeSchemaRequest>({ credentials, documentTypeId });
        const useCase = new GetDocumentTypeSchema(request, this.store);
        return this.executeUseCase(useCase);
    }

    async getSystemDataElements(credentials: Credentials): Promise<CoreResult<Array<DataElement>, AppCodeError, Error>> {
        const request = this.buildRequest<Credentials>(credentials);
        const useCase = new GetAllDataElemets(request, this.store);
        return this.executeUseCase(useCase);
    }

    async createDocumentGroup(body: CreateDocumentGroupRequest): Promise<CoreResult<DocumentGroup, AppCodeError, Error>> {
        const request = this.buildRequest<CreateDocumentGroupRequest>(body);
        const useCase = new CreateDocumentGroup(request, this.store);
        return this.executeUseCase(useCase);
    }

    async createDocumentType(body: CreateDocumentTypeRequest): Promise<CoreResult<DocumentType, AppCodeError, Error>> {
        const request = this.buildRequest<CreateDocumentTypeRequest>(body);
        const useCase = new CreateDocumentType(request, this.store);
        return this.executeUseCase(useCase);
    }

    async createDataElement(body: CreateDataElementRequest): Promise<CoreResult<DataElement, AppCodeError, Error>> {
        const request = this.buildRequest<CreateDataElementRequest>(body);
        const useCase = new CreateDataElement(request, this.store);
        return this.executeUseCase(useCase);
    }

    async assignDataElementToDocumentType(
        body: AssignDataElementToDocumentRequest
    ): Promise<CoreResult<boolean, AppCodeError, Error>> {
        const request = this.buildRequest<AssignDataElementToDocumentRequest>(body);
        const useCase = new AssignDataElement(request, this.store);
        return this.executeUseCase(useCase);
    }
}