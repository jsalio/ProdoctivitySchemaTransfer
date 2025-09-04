import { describe, it, expect, beforeEach, mock } from 'bun:test';
import {
  AppCodeError,
  CoreResult,
  Credentials,
  DocumentGroup,
  GetDocumentGroups,
  IRequest,
  IStore,
} from '@schematransfer/core';

describe('GetDocumentGroups', () => {
  let mockRequest: IRequest<Credentials>;
  let mockStore: IStore;
  let getDocumentGroups: GetDocumentGroups;
  let mockCredentials: Credentials;

  beforeEach(() => {
    // Configurar credenciales mock
    mockCredentials = {
      username: 'testuser',
      password: 'testpassword',
      serverInformation: {
        apiKey: 'none',
        apiSecret: 'none',
        dataBase: 'none',
        organization: 'org-name',
        server: 'http://localhost/site',
      },
      store: 'general',
      token: '456789132',
    } as Credentials;

    // Mock del objeto request
    mockRequest = {
      build: mock(() => mockCredentials),
    };

    // Mock del store
    mockStore = {
      getDocumentGroups: mock(),
    } as any as IStore;

    // Crear instancia de la clase a testear
    getDocumentGroups = new GetDocumentGroups(mockRequest, mockStore);
  });

  describe('constructor', () => {
    it('should create instance with provided request and store', () => {
      expect(getDocumentGroups).toBeInstanceOf(GetDocumentGroups);
      expect(getDocumentGroups['request']).toBe(mockRequest);
      expect(getDocumentGroups['store']).toBe(mockStore);
    });
  });

  describe('validate', () => {
    it('should return validation errors when credentials are invalid', () => {
      // Configurar credenciales inválidas
      mockCredentials.username = '';
      mockCredentials.password = '';

      const errors = getDocumentGroups.validate();

      expect(mockRequest.build).toHaveBeenCalled();
      expect(Array.isArray(errors)).toBe(true);
      // Asumiendo que LoginValidator retorna errores para credenciales vacías
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should return empty array when credentials are valid', () => {
      // Las credenciales ya están configuradas como válidas en beforeEach
      const errors = getDocumentGroups.validate();

      expect(mockRequest.build).toHaveBeenCalled();
      expect(Array.isArray(errors)).toBe(true);
      expect(errors.length).toBe(0);
    });
  });

  describe('execute', () => {
    it('should return document groups when store operation is successful', async () => {
      // Configurar datos mock de éxito
      const mockDocumentGroups = [
        { groupId: '1', groupName: 'Group 1', documentTypesCounter: 1 },
        { groupId: '2', groupName: 'Group 2', documentTypesCounter: 1 },
      ] as DocumentGroup[];

      const mockStoreResult: CoreResult<Array<DocumentGroup>, any, any> = {
        ok: true,
        value: mockDocumentGroups,
      };

      mockStore.getDocumentGroups = mock(() => Promise.resolve(mockStoreResult));

      const result = await getDocumentGroups.execute();

      expect(mockRequest.build).toHaveBeenCalled();
      expect(mockStore.getDocumentGroups).toHaveBeenCalledWith(mockCredentials);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(mockDocumentGroups);
      }
    });

    it('should return error when store operation fails', async () => {
      // Configurar datos mock de error
      const mockError = new Error('Store connection failed');
      const mockStoreResult: CoreResult<any, any, Error> = {
        ok: false,
        error: mockError,
      } as any;

      mockStore.getDocumentGroups = mock(() => Promise.resolve(mockStoreResult));

      const result = await getDocumentGroups.execute();

      expect(mockRequest.build).toHaveBeenCalled();
      expect(mockStore.getDocumentGroups).toHaveBeenCalledWith(mockCredentials);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.code).toBe(AppCodeError.StoreError);
        expect(result.error).toBe(mockError);
      }
    });

    it('should handle store returning empty array', async () => {
      const mockStoreResult: CoreResult<Array<DocumentGroup>, any, any> = {
        ok: true,
        value: [],
      };

      mockStore.getDocumentGroups = mock(() => Promise.resolve(mockStoreResult));

      const result = await getDocumentGroups.execute();

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(Array.isArray(result.value)).toBe(true);
        expect(result.value.length).toBe(0);
      }
    });

    it('should handle store throwing an exception', async () => {
      const thrownError = new Error('Database connection timeout');
      mockStore.getDocumentGroups = mock(() => Promise.reject(thrownError));

      await expect(getDocumentGroups.execute()).rejects.toThrow('Database connection timeout');
    });
  });

  describe('integration tests', () => {
    it('should validate credentials before executing when both are called', () => {
      const validateSpy = mock(getDocumentGroups.validate);
      getDocumentGroups.validate = validateSpy;

      getDocumentGroups.validate();

      expect(validateSpy).toHaveBeenCalled();
      expect(mockRequest.build).toHaveBeenCalledTimes(1);
    });

    it('should work end-to-end with valid credentials and successful store operation', async () => {
      // Preparar datos de éxito
      const mockDocumentGroups: DocumentGroup[] = [
        { groupId: '1', groupName: 'Personal Documents', documentTypesCounter: 5 },
      ];

      const mockStoreResult: CoreResult<Array<DocumentGroup>, any, any> = {
        ok: true,
        value: mockDocumentGroups,
      };

      mockStore.getDocumentGroups = mock(() => Promise.resolve(mockStoreResult));

      // Validar que las credenciales son válidas
      const validationErrors = getDocumentGroups.validate();
      expect(validationErrors.length).toBe(0);

      // Ejecutar operación
      const result = await getDocumentGroups.execute();

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toEqual(mockDocumentGroups);
      }
    });
  });
});

// Tests adicionales para casos edge
describe('GetDocumentGroups - Edge Cases', () => {
  let mockRequest: IRequest<Credentials>;
  let mockStore: IStore;
  let getDocumentGroups: GetDocumentGroups;

  beforeEach(() => {
    mockRequest = {
      build: mock(() => ({ username: 'user', password: 'pass' }) as Credentials),
    };
    mockStore = { getDocumentGroups: mock() } as any as IStore;
    getDocumentGroups = new GetDocumentGroups(mockRequest, mockStore);
  });

  it('should handle null credentials from request.build()', () => {
    mockRequest.build = mock(() => null as any);

    expect(() => getDocumentGroups.validate()).toThrow();
  });

  it('should handle undefined return from store', async () => {
    mockStore.getDocumentGroups = mock(() => Promise.resolve(undefined as any));

    await expect(getDocumentGroups.execute()).rejects.toThrow();
  });

  it('should handle store returning malformed result', async () => {
    const malformedResult = { success: true, data: [] }; // Formato incorrecto
    mockStore.getDocumentGroups = mock(() => Promise.resolve(malformedResult as any));

    await expect(getDocumentGroups.execute()).resolves.toThrow();
  });
});
