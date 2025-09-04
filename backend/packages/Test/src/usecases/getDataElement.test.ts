import { describe, it, expect, beforeEach, mock } from 'bun:test';
import {
  Credentials,
  GetAllDataElemets,
  IRequest,
  IStore,
  DataElement,
} from '@schematransfer/core';

describe('GetAllDataElements', () => {
  let mockRequest: IRequest<Credentials>;
  let mockStore: IStore;
  let getAllDataElements: GetAllDataElemets;
  let mockCredentials: Credentials;

  beforeEach(() => {
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

    mockRequest = { build: mock(() => mockCredentials) };
    mockStore = { getDataElements: mock() } as any as IStore;
    getAllDataElements = new GetAllDataElemets(mockRequest, mockStore);
  });

  describe('constructor', () => {
    it('should create instance with provided request and store', () => {
      expect(getAllDataElements).toBeInstanceOf(GetAllDataElemets);
      expect(getAllDataElements['request']).toBe(mockRequest);
      expect(getAllDataElements['store']).toBe(mockStore);
    });
  });

  describe('validate', () => {
    it('should return validation errors when credentials are invalid', () => {
      const invalidCredentials = { ...mockCredentials, username: '' };
      mockRequest = { build: mock(() => invalidCredentials) };
      const validator = new GetAllDataElemets(mockRequest, mockStore);
      const errors = validator.validate();
      expect(errors[0].field).toBe('username');
    });

    it('should return no errors when credentials are valid', () => {
      expect(getAllDataElements.validate()).toHaveLength(0);
    });
  });

  describe('execute', () => {
    it('should return data elements when store operation is successful', async () => {
      const mockDataElements: DataElement[] = [
        { id: '1', name: 'Element 1', required: 'true', dataType: 'number' },
      ];

      (mockStore.getDataElements as any).mockResolvedValue({
        ok: true,
        value: mockDataElements,
      });

      const result = await getAllDataElements.execute();
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual(mockDataElements);
      }
    });

    it('should return error when store operation fails', async () => {
      const mockError = new Error('Store operation failed');
      (mockStore.getDataElements as any).mockResolvedValue({
        ok: false,
        error: mockError,
      });

      const result = await getAllDataElements.execute();
      expect(result.ok).toBe(false);
    });
  });
});
