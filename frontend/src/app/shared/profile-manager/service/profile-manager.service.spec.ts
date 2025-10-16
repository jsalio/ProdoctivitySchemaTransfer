/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { ProfileManagerService } from './profile-manager.service';
import { MemStoreService } from '../../../services/ui/mem-store.service';
import { ToastService } from '../../../services/ui/toast.service';
import { ConnectionProfile } from '../../../types/models/ConnectionProfile';
import { Credentials } from '../../../types/models/Credentials';
import { Profiles } from '../../../types/models/Profiles';

describe('ProfileManagerService', () => {
  let service: ProfileManagerService;
  let memStoreSpy: jasmine.SpyObj<MemStoreService>;
  let toastSpy: jasmine.SpyObj<ToastService>;
  let profilesSignal: WritableSignal<ConnectionProfile[]>;

  const v5Creds: Credentials = {
    username: 'v5user',
    password: 'pass',
    serverInformation: {
      server: 'v5.server',
      organization: '',
      apiKey: '',
      apiSecret: '',
      dataBase: '',
    },
    store: 'V5' as any,
  } as Credentials;

  const cloudCreds: Credentials = {
    username: 'clouduser',
    password: 'pass',
    serverInformation: {
      server: 'cloud.server',
      organization: 'org1',
      apiKey: '',
      apiSecret: '',
      dataBase: '',
    },
    store: 'Cloud' as any,
  } as Credentials;

  const initialProfiles: ConnectionProfile[] = [
    { name: 'v5-a', default: true, credential: v5Creds },
    { name: 'v5-b', default: false, credential: v5Creds },
    { name: 'cloud-a', default: true, credential: cloudCreds },
    { name: 'cloud-b', default: false, credential: cloudCreds },
  ];

  beforeEach(() => {
    profilesSignal = signal<ConnectionProfile[]>([]);

    memStoreSpy = jasmine.createSpyObj<MemStoreService>('MemStoreService', [
      'signalOf',
      'updateValue',
      'getValue',
    ]);
    memStoreSpy.signalOf.and.callFake((key: string) => {
      if (key === 'Profiles') {
        return profilesSignal as any;
      }
      return signal<any>(null) as any;
    });

    toastSpy = jasmine.createSpyObj<ToastService>('ToastService', ['emitNotification']);

    TestBed.configureTestingModule({
      providers: [
        ProfileManagerService,
        { provide: MemStoreService, useValue: memStoreSpy },
        { provide: ToastService, useValue: toastSpy },
      ],
    });

    service = TestBed.inject(ProfileManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('rows', () => {
    it('should map profiles to table rows', () => {
      profilesSignal.set(initialProfiles);

      const rows = service.rows();
      expect(rows.length).toBe(4);
      expect(rows[0]).toEqual(
        jasmine.objectContaining<Partial<Profiles>>({
          name: 'v5-a',
          default: true,
          accountName: 'v5user',
          server: 'v5.server',
          organization: 'Por defecto',
          store: 'ProDoctivity 5',
        }),
      );
      expect(rows[2]).toEqual(
        jasmine.objectContaining<Partial<Profiles>>({
          name: 'cloud-a',
          default: true,
          accountName: 'clouduser',
          server: 'cloud.server',
          organization: 'org1',
          store: 'ProDoctivity Cloud',
        }),
      );
    });

    it('should return empty array when no profiles', () => {
      profilesSignal.set([]);
      expect(service.rows()).toEqual([]);
    });
  });

  describe('setAsDefault', () => {
    it('should set default within same store and update credentials & store', () => {
      profilesSignal.set(initialProfiles);

      service.setAsDefault('v5-b');

      const updated = service.profiles();
      const v5b = updated.find((p) => p.name === 'v5-b');
      const v5a = updated.find((p) => p.name === 'v5-a');
      expect(v5b?.default).toBeTrue();
      expect(v5a?.default).toBeFalse();
      expect(memStoreSpy.updateValue).toHaveBeenCalledWith('Profiles', updated);
      expect(memStoreSpy.updateValue).toHaveBeenCalledWith('Credentials_V5_V5', v5b!.credential);
      expect(toastSpy.emitNotification).toHaveBeenCalledWith({
        message: 'Perfil por defecto de V5 establecido',
        duration: 2000,
      });
    });

    it('should no-op if profile name does not exist', () => {
      profilesSignal.set(initialProfiles);
      memStoreSpy.updateValue.calls.reset();

      service.setAsDefault('non-existent');

      expect(memStoreSpy.updateValue).not.toHaveBeenCalled();
      expect(toastSpy.emitNotification).not.toHaveBeenCalled();
    });
  });

  describe('removeProfile', () => {
    it('should remove existing profile and reselect next same store as default', () => {
      profilesSignal.set(initialProfiles);
      memStoreSpy.updateValue.calls.reset();

      service.removeProfile('v5-a');

      const updated = service.profiles();
      expect(updated.find((p) => p.name === 'v5-a')).toBeUndefined();
      // v5-b should become default
      const v5b = updated.find((p) => p.name === 'v5-b');
      expect(v5b?.default).toBeTrue();

      expect(memStoreSpy.updateValue).toHaveBeenCalledWith('Profiles', jasmine.any(Array));
      expect(memStoreSpy.updateValue).toHaveBeenCalledWith('Credentials_V5_V5', v5b!.credential);
      expect(toastSpy.emitNotification).toHaveBeenCalledWith({
        message: 'Perfil de borrado',
        duration: 2000,
      });
    });

    it('should no-op except sync when profile not found', () => {
      profilesSignal.set(initialProfiles);
      memStoreSpy.updateValue.calls.reset();

      service.removeProfile('non-existent');

      expect(memStoreSpy.updateValue).toHaveBeenCalledWith('Profiles', initialProfiles);
      // No default change expected
      expect(memStoreSpy.updateValue).not.toHaveBeenCalledWith(
        'Credentials_V5_V5',
        jasmine.anything(),
      );
      expect(memStoreSpy.updateValue).not.toHaveBeenCalledWith(
        'Credentials_V6_Cloud',
        jasmine.anything(),
      );
    });

    it('should update profiles and not set default when no next profile in same store', () => {
      // Only one V5 profile
      profilesSignal.set([
        { name: 'v5-a', default: true, credential: v5Creds },
        { name: 'cloud-a', default: true, credential: cloudCreds },
      ]);
      memStoreSpy.updateValue.calls.reset();

      service.removeProfile('v5-a');

      const updated = service.profiles();
      expect(updated.find((p) => p.name === 'v5-a')).toBeUndefined();
      // No V5 next, so no credentials update for V5
      expect(memStoreSpy.updateValue).toHaveBeenCalledWith('Profiles', jasmine.any(Array));
      expect(memStoreSpy.updateValue).not.toHaveBeenCalledWith(
        'Credentials_V5_V5',
        jasmine.anything(),
      );
      expect(toastSpy.emitNotification).toHaveBeenCalledWith({
        message: 'Perfil de borrado',
        duration: 2000,
      });
    });
  });

  describe('showNotification', () => {
    it('should emit toast with message and duration 2000', () => {
      service.showNotification('hello');
      expect(toastSpy.emitNotification).toHaveBeenCalledWith({ message: 'hello', duration: 2000 });
    });
  });
});
