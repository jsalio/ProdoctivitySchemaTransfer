import { describe, it, expect, beforeEach, mock } from 'bun:test';
import {
  AppCodeError,
  Credentials,
  CreateDataElement,
  IRequest,
  IStore,
  DataElement,
  CreateDataElementRequest,
} from '@schematransfer/core';

describe('CreateDataElement', () => {
  let mockRequest: IRequest<CreateDataElementRequest>;
  let mockStore: IStore;
  let createDataElement: CreateDataElement;
  let mockCredentials: Credentials;
  const elementName = 'Test Data Element';
  const dataType = 'string';
  const isRequired = true;

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
        createDataElementRequest: {
          name: elementName,
          dataType: dataType,
          isRequired: isRequired,
        },
      })),
    };

    // Mock store with createDataElement method
    mockStore = {
      createDataElement: mock(),
    } as any as IStore;

    // Create instance of the class to test
    createDataElement = new CreateDataElement(mockRequest, mockStore);
  });

  describe('constructor', () => {
    it('should create instance with provided request and store', () => {
      expect(createDataElement).toBeInstanceOf(CreateDataElement);
      expect(createDataElement['request']).toBe(mockRequest);
      expect(createDataElement['store']).toBe(mockStore);
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
          createDataElementRequest: {
            name: elementName,
            dataType: dataType,
            isRequired: isRequired,
          },
        })),
      };

      const validator = new CreateDataElement(mockRequest, mockStore);
      const errors = validator.validate();

      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].field).toBe('username');
    });

    it('should return no errors when credentials are valid', () => {
      const errors = createDataElement.validate();
      expect(errors).toHaveLength(0);
    });
  });

  describe('execute', () => {
    it('should create and return data element when store operation is successful', async () => {
      // Mock successful response
      const mockDataElement: DataElement = {
        id: 'test-element-1',
        name: elementName,
        dataType: dataType,
        required: isRequired.toString(),
      };

      (mockStore.createDataElement as any).mockResolvedValueOnce({
        ok: true,
        value: mockDataElement,
      });

      const result = await createDataElement.execute();

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual(mockDataElement);
      }
      expect(mockStore.createDataElement).toHaveBeenCalledWith(mockCredentials, {
        name: elementName,
        documentTypeId: '',
        dataType: dataType,
        required: isRequired,
      });
    });

    it('should return error when store operation fails', async () => {
      // Mock error response
      const mockError = new Error('Failed to create data element');
      (mockStore.createDataElement as any).mockResolvedValueOnce({
        ok: false,
        error: mockError,
      });

      const result = await createDataElement.execute();

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.code).toBe(AppCodeError.StoreError);
        expect(result.error).toBe(mockError);
      }
    });

    it('should return error when store does not implement createDataElement', async () => {
      // Create store without createDataElement implementation
      const storeWithoutMethod = {} as IStore;
      const testCase = new CreateDataElement(mockRequest, storeWithoutMethod);

      const result = await testCase.execute();

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.code).toBe(AppCodeError.StoreError);
        expect(result.error).toBeInstanceOf(Error);
        expect(result.error.message).toContain('does not implement createDataElement method');
      }
    });
  });
});
