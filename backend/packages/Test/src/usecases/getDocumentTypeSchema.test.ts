import { describe, it, expect, beforeEach, mock } from 'bun:test';
import {
  AppCodeError,
  Credentials,
  GetDocumentTypeSchema,
  IRequest,
  IStore,
  SchemaDocumentType,
  GetDocumentTypeSchemaRequest,
} from '@schematransfer/core';

describe('GetDocumentTypeSchema', () => {
  let mockRequest: IRequest<GetDocumentTypeSchemaRequest>;
  let mockStore: IStore;
  let getDocumentTypeSchema: GetDocumentTypeSchema;
  let mockCredentials: Credentials;
  const mockDocumentTypeId = 'test-doc-type-1';

  beforeEach(() => {
    // Setup mock credentials
    mockCredentials = {
      username: 'testuser',
      password: 'testpassword',
      serverInformation: {
        apiKey: 'test-api-key',
        apiSecret: 'test-api-secret',
        dataBase: 'test-db',
        organization: 'test-org',
        server: 'http://test-server.com',
      },
      store: 'test-store',
      token: 'test-token',
    } as Credentials;

    // Mock request object
    mockRequest = {
      build: mock(() => ({
        credentials: mockCredentials,
        documentTypeId: mockDocumentTypeId,
      })),
    };

    // Mock store
    mockStore = {
      getDocumentTypeSchema: mock(),
    } as any as IStore;

    // Create instance of the class to test
    getDocumentTypeSchema = new GetDocumentTypeSchema(mockRequest, mockStore);
  });

  describe('constructor', () => {
    it('should create instance with provided request and store', () => {
      expect(getDocumentTypeSchema).toBeInstanceOf(GetDocumentTypeSchema);
      expect(getDocumentTypeSchema['request']).toBe(mockRequest);
      expect(getDocumentTypeSchema['store']).toBe(mockStore);
    });
  });

  describe('validate', () => {
    it('should return validation errors when credentials are invalid', () => {
      // Set invalid credentials
      const invalidCredentials = {
        ...mockCredentials,
        username: '', // Invalid: empty username
      };

      mockRequest = {
        build: mock(() => ({
          credentials: invalidCredentials,
          documentTypeId: mockDocumentTypeId,
        })),
      };

      const validator = new GetDocumentTypeSchema(mockRequest, mockStore);
      const errors = validator.validate();

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].field).toBe('username');
    });

    it('should return no errors when credentials are valid', () => {
      const errors = getDocumentTypeSchema.validate();
      expect(errors).toHaveLength(0);
    });
  });

  describe('execute', () => {
    it('should return document type schema when store operation is successful', async () => {
      // Mock successful response
      const mockSchema: SchemaDocumentType = {
        documentTypeId: mockDocumentTypeId,
        name: 'Test Document Type',
        keywords: [
          {
            label: 'Field 1',
            name: 'Field 1',
            dataType: 'string',
            require: true,
          },
        ],
      };

      (mockStore.getDocumentTypeSchema as any).mockResolvedValueOnce({
        ok: true,
        value: mockSchema,
      });

      const result = await getDocumentTypeSchema.execute();

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual(mockSchema);
      }
      expect(mockStore.getDocumentTypeSchema).toHaveBeenCalledWith(
        mockCredentials,
        mockDocumentTypeId,
      );
    });

    it('should return error when store operation fails', async () => {
      // Mock error response
      const mockError = new Error('Store operation failed');
      (mockStore.getDocumentTypeSchema as any).mockResolvedValueOnce({
        ok: false,
        error: mockError,
      });

      const result = await getDocumentTypeSchema.execute();

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.code).toBe(AppCodeError.StoreError);
        expect(result.error).toBe(mockError);
      }
    });
  });
});

describe('GetDocumentTypeSchema - Edge Cases', () => {
  it('should handle empty document type ID', async () => {
    const mockRequest = {
      build: mock(() => ({
        credentials: {
          username: 'testuser',
          password: 'testpass',
          serverInformation: {
            apiKey: 'test',
            apiSecret: 'test',
            dataBase: 'test',
            organization: 'test',
            server: 'http://test.com',
          },
          store: 'test',
          token: 'test',
        },
        documentTypeId: '', // Empty document type ID
      })),
    };

    const mockStore = {
      getDocumentTypeSchema: mock(),
    } as any as IStore;

    const getDocumentTypeSchema = new GetDocumentTypeSchema(mockRequest, mockStore);

    // Should still validate (document type ID validation would be in the request validation)
    const errors = getDocumentTypeSchema.validate();
    expect(errors).toHaveLength(0);

    // But the store should receive the empty document type ID
    (mockStore.getDocumentTypeSchema as any).mockResolvedValueOnce({
      ok: true,
      value: {},
    });

    await getDocumentTypeSchema.execute();
    expect(mockStore.getDocumentTypeSchema).toHaveBeenCalledWith(expect.anything(), '');
  });
});
