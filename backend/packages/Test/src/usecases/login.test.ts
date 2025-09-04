import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { Credentials, Login, IRequest, IStore, Result } from '@schematransfer/core';

describe('Login', () => {
  let mockRequest: IRequest<Credentials>;
  let mockStore: IStore;
  let login: Login;
  let mockCredentials: Credentials;

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
      build: mock(() => mockCredentials),
    };

    // Mock store
    mockStore = {
      login: mock(),
    } as any as IStore;

    // Create instance of the class to test
    login = new Login(mockRequest, mockStore);
  });

  describe('constructor', () => {
    it('should create instance with provided request and store', () => {
      expect(login).toBeInstanceOf(Login);
      expect(login['request']).toBe(mockRequest);
      expect(login['store']).toBe(mockStore);
    });
  });

  describe('validate', () => {
    it('should return validation errors when credentials are invalid', () => {
      // Set invalid credentials
      mockCredentials.username = '';
      mockCredentials.password = '';

      const errors = login.validate();

      expect(mockRequest.build).toHaveBeenCalled();
      expect(Array.isArray(errors)).toBe(true);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should return empty array when credentials are valid', () => {
      const errors = login.validate();

      expect(mockRequest.build).toHaveBeenCalled();
      expect(Array.isArray(errors)).toBe(true);
      expect(errors.length).toBe(0);
    });
  });

  describe('execute', () => {
    it('should return success with store info and token when login is successful (Prodoctivity V5)', async () => {
      // Setup mock success for V5
      const mockLoginResult: Result<string, Error> = {
        ok: true,
        value: 'valid-token',
      };

      mockStore.login = mock(() => Promise.resolve(mockLoginResult));

      const result = await login.execute();

      expect(mockRequest.build).toHaveBeenCalled();
      expect(mockStore.login).toHaveBeenCalledWith({ ...mockCredentials });
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.token).toBe('valid-token');
        expect(result.value.store).toBe('Prodoctivity V5');
      }
    });

    it('should return success with store info and token when login is successful (Prodoctivity Cloud)', async () => {
      // Setup for Prodoctivity Cloud (no database)
      mockCredentials.serverInformation.dataBase = '';

      const mockLoginResult: Result<string, Error> = {
        ok: true,
        value: 'test-jwt-token-cloud',
      };

      mockStore.login = mock(() => Promise.resolve(mockLoginResult));

      const result = await login.execute();

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.store).toBe('Prodoctivity Cloud');
      }
    });

    it('should return error when store login fails', async () => {
      const mockError = new Error('Authentication failed');
      const mockLoginResult: Result<string, Error> = {
        ok: false,
        error: mockError,
      };

      mockStore.login = mock(() => Promise.resolve(mockLoginResult));

      const result = await login.execute();

      expect(mockRequest.build).toHaveBeenCalled();
      expect(mockStore.login).toHaveBeenCalledWith(mockCredentials);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe(mockError);
      }
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    it('should handle missing server information', async () => {
      const invalidCredentials: Credentials = {
        username: 'testuser',
        password: 'testpass',
        serverInformation: {} as any,
        store: 'test-store',
      };

      mockRequest = {
        build: mock(() => invalidCredentials),
      };

      mockStore = {
        login: mock(),
      } as any as IStore;

      login = new Login(mockRequest, mockStore);

      const errors = login.validate();
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should handle network errors during login', async () => {
      const networkError = new Error('Network error');
      mockStore.login = mock(() => Promise.reject(networkError));

      await expect(login.execute()).rejects.toThrow('Network error');
    });

    it('should handle when store.login resolves with not undefined value', async () => {
      const mockLoginResult: Result<string, Error> = {
        ok: true,
        value: undefined as any,
      };

      mockStore.login = mock(() => Promise.resolve(mockLoginResult));

      const result = await login.execute();
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.token).toBe(undefined as any);
      }
    });
  });
});
