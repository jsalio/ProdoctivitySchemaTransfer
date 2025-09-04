import { describe, it, expect, beforeEach, mock } from "bun:test";
import { AppCodeError, Credentials, DocumentType, GetDocumentTypesGroups, IRequest, IStore, GetDocumentGroupRequest } from "@schematransfer/core"

describe("GetDocumentTypesGroups", () => {
    let mockRequest: IRequest<GetDocumentGroupRequest>;
    let mockStore: IStore;
    let getDocumentTypesGroups: GetDocumentTypesGroups;
    let mockCredentials: Credentials;
    const mockGroupId = "test-group-1";

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
                groupId: mockGroupId
            }))
        };

        // Mock store
        mockStore = {
            getDocumentTypeInGroup: mock()
        } as any as IStore;

        // Create instance of the class to test
        getDocumentTypesGroups = new GetDocumentTypesGroups(mockRequest, mockStore);
    });

    describe("constructor", () => {
        it("should create instance with provided request and store", () => {
            expect(getDocumentTypesGroups).toBeInstanceOf(GetDocumentTypesGroups);
            expect(getDocumentTypesGroups["request"]).toBe(mockRequest);
            expect(getDocumentTypesGroups["store"]).toBe(mockStore);
        });
    });

    describe("validate", () => {
        it("should return validation errors when credentials are invalid", () => {
            // Set invalid credentials
            const invalidCredentials = {
                ...mockCredentials,
                username: "" // Invalid: empty username
            };
            
            mockRequest = {
                build: mock(() => ({
                    credentials: invalidCredentials,
                    groupId: mockGroupId
                }))
            };
            
            const validator = new GetDocumentTypesGroups(mockRequest, mockStore);
            const errors = validator.validate();
            
            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0].field).toBe("username");
        });

        it("should return no errors when credentials are valid", () => {
            const errors = getDocumentTypesGroups.validate();
            expect(errors).toHaveLength(0);
        });
    });

    describe("execute", () => {
        it("should return document types when store operation is successful", async () => {
            // Mock successful response
            const mockDocumentTypes: DocumentType[] = [
                { documentTypeId: "1", documentTypeName: "Type 1" },
                { documentTypeId: "2", documentTypeName: "Type 2" }
            ];
            
            (mockStore.getDocumentTypeInGroup as any).mockResolvedValueOnce({
                ok: true,
                value: mockDocumentTypes
            });

            const result = await getDocumentTypesGroups.execute();

            expect(result.ok).toBe(true);
            if (result.ok) {
                expect(result.value).toEqual(mockDocumentTypes);
            }
            expect(mockStore.getDocumentTypeInGroup).toHaveBeenCalledWith(mockCredentials, mockGroupId);
        });

        it("should return error when store operation fails", async () => {
            // Mock error response
            const mockError = new Error("Store operation failed");
            (mockStore.getDocumentTypeInGroup as any).mockResolvedValueOnce({
                ok: false,
                error: mockError
            });

            const result = await getDocumentTypesGroups.execute();

            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.code).toBe(AppCodeError.StoreError);
                expect(result.error).toBe(mockError);
            }
        });
    });
});

describe("GetDocumentTypesGroups - Edge Cases", () => {
    it("should handle empty group ID", async () => {
        const mockRequest = {
            build: mock(() => ({
                credentials: {
                    username: "testuser",
                    password: "testpass",
                    serverInformation: {
                        apiKey: "test",
                        apiSecret: "test",
                        dataBase: "test",
                        organization: "test",
                        server: "http://test.com"
                    },
                    store: "test",
                    token: "test"
                },
                groupId: "" // Empty group ID
            }))
        };

        const mockStore = {
            getDocumentTypeInGroup: mock()
        } as any as IStore;

        const getDocumentTypesGroups = new GetDocumentTypesGroups(mockRequest, mockStore);
        
        // Should still validate (group ID validation would be in the request validation)
        const errors = getDocumentTypesGroups.validate();
        expect(errors).toHaveLength(0);
        
        // But the store should receive the empty group ID
        (mockStore.getDocumentTypeInGroup as any).mockResolvedValueOnce({
            ok: true,
            value: []
        });
        
        await getDocumentTypesGroups.execute();
        expect(mockStore.getDocumentTypeInGroup).toHaveBeenCalledWith(expect.anything(), "");
    });
});