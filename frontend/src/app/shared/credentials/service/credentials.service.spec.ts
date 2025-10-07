import { TestBed } from '@angular/core/testing';
import { CredentialsService } from './credentials.service';
import { AuthService } from '../../../services/backend/auth.service';
import { MemStoreService } from '../../../services/ui/mem-store.service';
import { CredetialConnectionService } from '../../../services/ui/credetial-connection.service';
import { ToastService } from '../../../services/ui/toast.service';
import { of } from 'rxjs';
import { StorageKey } from '../../../types/models/StorageKey';
import { Credentials } from '../credentials.component';

describe('CredentialsService', () => {
  let service: CredentialsService;
  let authSpy: jasmine.SpyObj<AuthService>;
  let memSpy: jasmine.SpyObj<MemStoreService>;
  let connSpy: jasmine.SpyObj<CredetialConnectionService>;
  let toastSpy: jasmine.SpyObj<ToastService>;

  const sampleCreds: Credentials = {
    username: 'user',
    password: 'pass',
    store: 'Cloud',
    serverInformation: {
      apiKey: 'k',
      apiSecret: 's',
      organization: 'org',
      dataBase: 'db',
      server: 'srv',
    },
  };

  beforeEach(() => {
    authSpy = jasmine.createSpyObj<AuthService>('AuthService', ['login']);
    memSpy = jasmine.createSpyObj<MemStoreService>('MemStoreService', [
      'storeValue',
      'updateValue',
      'signalOf',
      'getValue',
    ]);
    connSpy = jasmine.createSpyObj<CredetialConnectionService>('CredetialConnectionService', [
      'updateCredentials',
    ]);
    toastSpy = jasmine.createSpyObj<ToastService>('ToastService', ['emitNotification']);

    TestBed.configureTestingModule({
      providers: [
        CredentialsService,
        { provide: AuthService, useValue: authSpy },
        { provide: MemStoreService, useValue: memSpy },
        { provide: CredetialConnectionService, useValue: connSpy },
        { provide: ToastService, useValue: toastSpy },
      ],
    });

    service = TestBed.inject(CredentialsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('computeKey', () => {
    it('returns key for Cloud', () => {
      const key = service.computeKey('Cloud');
      expect(key).toBe('Credentials_V6_Cloud' as StorageKey);
    });
    it('returns key for V5', () => {
      const key = service.computeKey('V5');
      expect(key).toBe('Credentials_V5_V5' as StorageKey);
    });
  });

  describe('login', () => {
    it('delegates to AuthService.login', () => {
      authSpy.login.and.returnValue(of({ data: { store: '', token: '' }, success: true }));
      service.login(sampleCreds).subscribe();
      expect(authSpy.login).toHaveBeenCalledWith(sampleCreds);
    });
  });

  describe('persistCredentials', () => {
    it('updates connection service for Cloud', () => {
      service.persistCredentials('Credentials_V6_Cloud' as StorageKey, 'Cloud', sampleCreds);
      expect(connSpy.updateCredentials).toHaveBeenCalledWith(sampleCreds);
      expect(memSpy.storeValue).not.toHaveBeenCalled();
    });

    it('stores value for V5', () => {
      const creds: Credentials = { ...sampleCreds, store: 'V5' };
      service.persistCredentials('Credentials_V5_V5' as StorageKey, 'V5', creds);
      expect(memSpy.storeValue).toHaveBeenCalledWith('Credentials_V5_V5' as StorageKey, creds);
      expect(connSpy.updateCredentials).not.toHaveBeenCalled();
    });
  });

  describe('showToast', () => {
    it('emits toast with provided message', () => {
      service.showToast('hello');
      expect(toastSpy.emitNotification).toHaveBeenCalledWith({
        message: 'hello',
        duration: jasmine.any(Number),
      });
    });
  });
});
