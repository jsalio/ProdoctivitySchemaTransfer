import { describe, it, expect, beforeEach, mock } from 'bun:test';
import {
  AppCodeError,
  Credentials,
  CreateDocumentGroup,
  IRequest,
  IStore,
  DocumentGroup,
  CreateDocumentGroupRequest,
} from '@schematransfer/core';

describe('CreateDocumentGroup', () => {
  let mockRequest: IRequest<CreateDocumentGroupRequest>;
  let mockStore: IStore;
  let createDocumentGroup: CreateDocumentGroup;
  let mockCredentials: Credentials;
  const groupName = 'Test Group';

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
        name: groupName,
      })),
    };

    // Mock store with createDocumentGroup method
    mockStore = {
      createDocumentGroup: mock(),
    } as any as IStore;

    // Create instance of the class to test
    createDocumentGroup = new CreateDocumentGroup(mockRequest, mockStore);
  });

  describe('constructor', () => {
    it('should create instance with provided request and store', () => {
      expect(createDocumentGroup).toBeInstanceOf(CreateDocumentGroup);
      expect(createDocumentGroup['request']).toBe(mockRequest);
      expect(createDocumentGroup['store']).toBe(mockStore);
    });
  });

  describe('validate', () => {
    it('should return validation errors when credentials are invalid', () => {
      const invalidCredentials = {
        ...mockCredentials,
        username: '', // Invalid: empty username
      };

      mockRequest = {
        build: mock(() => ({
          credentials: invalidCredentials,
          name: groupName,
        })),
      };

      const validator = new CreateDocumentGroup(mockRequest, mockStore);
      const errors = validator.validate();

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].field).toBe('username');
    });

    it('should return no errors when credentials are valid', () => {
      const errors = createDocumentGroup.validate();
      expect(errors).toHaveLength(0);
    });
  });

  describe('execute', () => {
    it('should create and return document group when store operation is successful', async () => {
      // Mock successful response
      const mockDocumentGroup: DocumentGroup = {
        groupId: 'test-group-1',
        groupName: groupName,
        documentTypesCounter: 0,
      };

      (mockStore.createDocumentGroup as any).mockResolvedValueOnce({
        ok: true,
        value: mockDocumentGroup,
      });

      const result = await createDocumentGroup.execute();

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual(mockDocumentGroup);
      }
      expect(mockStore.createDocumentGroup).toHaveBeenCalledWith(mockCredentials, groupName);
    });

    it('should return error when store operation fails', async () => {
      // Mock error response
      const mockError = new Error('Failed to create document group');
      (mockStore.createDocumentGroup as any).mockResolvedValueOnce({
        ok: false,
        error: mockError,
      });

      const result = await createDocumentGroup.execute();

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.code).toBe(AppCodeError.StoreError);
        expect(result.error).toBe(mockError);
      }
    });

    it('should return error when store does not implement createDocumentGroup', async () => {
      // Create store without createDocumentGroup implementation
      const storeWithoutMethod = {} as IStore;
      const testCase = new CreateDocumentGroup(mockRequest, storeWithoutMethod);

      const result = await testCase.execute();

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.code).toBe(AppCodeError.StoreError);
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toContain('does not implement createDocumentGroup method');
      }
    });
  });
});
