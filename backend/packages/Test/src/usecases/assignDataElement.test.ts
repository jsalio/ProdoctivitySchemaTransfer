import { describe, it, expect, beforeEach, mock } from "bun:test";
import { AppCodeError, Credentials, AssignDataElement, IRequest, IStore, AssignDataElementToDocumentRequest } from "@schematransfer/core"

describe("AssignDataElement", () => {
    let mockRequest: IRequest<AssignDataElementToDocumentRequest>;
    let mockStore: IStore;
    let assignDataElement: AssignDataElement;
    let mockCredentials: Credentials;
    const documentTypeId = "test-doc-type-1";
    const dataElementName = "Test Data Element";
    const order = 1;

    beforeEach(() => {
        // Setup mock credentials
        mockCredentials = {
            username: "testuser",
            password: "testpassword",
            serverInformation: {
                apiKey: "test-api-key",
                apiSecret: "test-api-secret",
                dataBase: "test-db",
                organization: "test-org",
                server: "http://test-server.com"
            },
            store: "test-store",
            token: "test-token"
        } as Credentials;

        // Mock request object
        mockRequest = {
            build: mock(() => ({
                credentials: mockCredentials,
                assignDataElementToDocumentRequest: {
                    documentTypeId: documentTypeId,
                    dataElement: {
                        name: dataElementName,
                        order: order
                    }
                }
            }))
        };

        // Mock store with assignDataElementToDocumentType method
        mockStore = {
            assignDataElementToDocumentType: mock()
        } as any as IStore;

        // Create instance of the class to test
        assignDataElement = new AssignDataElement(mockRequest, mockStore);
    });

    describe("constructor", () => {
        it("should create instance with provided request and store", () => {
            expect(assignDataElement).toBeInstanceOf(AssignDataElement);
            expect(assignDataElement["request"]).toBe(mockRequest);
            expect(assignDataElement["store"]).toBe(mockStore);
        });
    });

    describe("validate", () => {
        it("should return validation errors when credentials are invalid", () => {
            const invalidCredentials = {
                ...mockCredentials,
                username: "" // Invalid: empty username
            };
            
            mockRequest = {
                build: mock(() => ({
                    credentials: invalidCredentials,
                    assignDataElementToDocumentRequest: {
                        documentTypeId: documentTypeId,
                        dataElement: {
                            name: dataElementName,
                            order: order
                        }
                    }
                }))
            };
            
            const validator = new AssignDataElement(mockRequest, mockStore);
            const errors = validator.validate();
            
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].field).toBe("username");
        });

        it("should return no errors when credentials are valid", () => {
            const errors = assignDataElement.validate();
            expect(errors).toHaveLength(0);
        });
    });

    describe("execute", () => {
        it("should assign data element to document type when store operation is successful", async () => {
            // Mock successful response
            (mockStore.assignDataElementToDocumentType as any).mockResolvedValueOnce({
                ok: true,
                value: true
            });

            const result = await assignDataElement.execute();

            expect(result.ok).toBe(true);
            if (result.ok) {
                expect(result.value).toBe(true);
            }
            expect(mockStore.assignDataElementToDocumentType).toHaveBeenCalledWith(
                mockCredentials,
                {
                    documentTypeId: documentTypeId,
                    dataElement: {
                        name: dataElementName,
                        order: order
                    }
                }
            );
        });

        it("should return error when store operation fails", async () => {
            // Mock error response
            const mockError = new Error("Failed to assign data element");
            (mockStore.assignDataElementToDocumentType as any).mockResolvedValueOnce({
                ok: false,
                error: mockError
            });

            const result = await assignDataElement.execute();

            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.code).toBe(AppCodeError.StoreError);
                expect(result.error).toBe(mockError);
            }
        });

        it("should return error when store does not implement assignDataElementToDocumentType", async () => {
            // Create store without assignDataElementToDocumentType implementation
            const storeWithoutMethod = {} as IStore;
            const testCase = new AssignDataElement(mockRequest, storeWithoutMethod);
            
            const result = await testCase.execute();
            
            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.code).toBe(AppCodeError.StoreError);
                expect(result.error).toBeInstanceOf(Error);
                expect(result.error.message).toContain("does not implement assignDataElementToDocumentType method");
            }
        });
    });
});