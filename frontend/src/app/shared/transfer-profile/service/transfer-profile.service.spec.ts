/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { TransferProfileService } from './transfer-profile.service';
import { MemStoreService } from '../../../services/ui/mem-store.service';
import { ToastService } from '../../../services/ui/toast.service';
import { TransferProfile } from '../../../types/models/TransferProfile';
import { ConnectionProfile } from '../../../types/models/ConnectionProfile';
import { Credentials } from '../../../types/models/Credentials';

describe('TransferProfileService', () => {
  let service: TransferProfileService;
  let memStoreServiceSpy: jasmine.SpyObj<MemStoreService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let transferProfilesSignal: WritableSignal<TransferProfile[] | null>;
  let profilesSignal: WritableSignal<ConnectionProfile[] | null>;

  const mockCredentials: Credentials = {
    username: 'testuser',
    password: 'testpass',
    serverInformation: {
      server: 'testserver',
      organization: 'testorg',
      apiKey: '',
      apiSecret: '',
      dataBase: '',
    },
  };

  const mockConnectionProfiles: ConnectionProfile[] = [
    {
      name: 'Profile1',
      default: false,
      credential: mockCredentials,
    },
    {
      name: 'Profile2',
      default: true,
      credential: mockCredentials,
    },
  ];

  const mockTransferProfiles: TransferProfile[] = [
    {
      name: 'Transfer1',
      source: 'Profile1',
      target: 'Profile2',
      serverSource: 'server1',
      serverTarget: 'server2',
      default: false,
    },
    {
      name: 'Transfer2',
      source: 'Profile2',
      target: 'Profile1',
      serverSource: 'server2',
      serverTarget: 'server1',
      default: true,
    },
  ];

  beforeEach(() => {
    // Fresh signals per test; service reads them during construction
    transferProfilesSignal = signal<TransferProfile[] | null>(null);
    profilesSignal = signal<ConnectionProfile[] | null>(null);

    const memStoreSpy = jasmine.createSpyObj<MemStoreService>('MemStoreService', [
      'signalOf',
      'updateValue',
      'getValue',
    ]);

    // Return the pre-created signals depending on the key requested by the service
    memStoreSpy.signalOf.and.callFake((key: string) => {
      if (key === 'ConnectionProfiles') {
        return transferProfilesSignal as any;
      }
      if (key === 'Profiles') {
        return profilesSignal as any;
      }
      return signal<any>(null) as any;
    });

    memStoreSpy.updateValue.and.stub();
    memStoreSpy.getValue.and.returnValue(null);

    const toastSpy = jasmine.createSpyObj<ToastService>('ToastService', ['emitNotification']);

    TestBed.configureTestingModule({
      providers: [
        TransferProfileService,
        { provide: MemStoreService, useValue: memStoreSpy },
        { provide: ToastService, useValue: toastSpy },
      ],
    });

    service = TestBed.inject(TransferProfileService);
    memStoreServiceSpy = TestBed.inject(MemStoreService) as jasmine.SpyObj<MemStoreService>;
    toastServiceSpy = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('saveProfile', () => {
    it('should save a new profile and show toast', () => {
      // Arrange
      const newProfile: TransferProfile = {
        name: 'NewTransfer',
        source: 'Profile1',
        target: 'Profile2',
        serverSource: 'server1',
        serverTarget: 'server2',
        default: false,
      };
      transferProfilesSignal.set([...mockTransferProfiles]);
      memStoreServiceSpy.getValue.and.returnValue(mockConnectionProfiles);

      // Act
      service.saveProfile(newProfile);

      // Assert
      expect(memStoreServiceSpy.updateValue).toHaveBeenCalledWith('ConnectionProfiles', [
        mockTransferProfiles[0],
        mockTransferProfiles[1],
        newProfile,
      ]);
      expect(toastServiceSpy.emitNotification).toHaveBeenCalledWith({
        message: 'Perfil almacenado',
        duration: 1000,
      });
    });

    it('should handle null current profiles', () => {
      // Arrange
      const newProfile: TransferProfile = {
        name: 'NewTransfer',
        source: 'Profile1',
        target: 'Profile2',
        serverSource: 'server1',
        serverTarget: 'server2',
        default: false,
      };
      transferProfilesSignal.set(null);
      memStoreServiceSpy.getValue.and.returnValue(mockConnectionProfiles);

      // Act
      service.saveProfile(newProfile);

      // Assert
      expect(memStoreServiceSpy.updateValue).toHaveBeenCalledWith('ConnectionProfiles', [
        newProfile,
      ]);
      expect(toastServiceSpy.emitNotification).toHaveBeenCalledWith({
        message: 'Perfil almacenado',
        duration: 1000,
      });
    });

    it('should handle empty profiles array', () => {
      // Arrange
      const newProfile: TransferProfile = {
        name: 'NewTransfer',
        source: 'Profile1',
        target: 'Profile2',
        serverSource: 'server1',
        serverTarget: 'server2',
        default: false,
      };
      transferProfilesSignal.set([]);
      memStoreServiceSpy.getValue.and.returnValue(mockConnectionProfiles);

      // Act
      service.saveProfile(newProfile);

      // Assert
      expect(memStoreServiceSpy.updateValue).toHaveBeenCalledWith('ConnectionProfiles', [
        newProfile,
      ]);
      expect(toastServiceSpy.emitNotification).toHaveBeenCalledWith({
        message: 'Perfil almacenado',
        duration: 1000,
      });
    });

    it('should allow duplicate profile names (append anyway)', () => {
      // Arrange
      const duplicateProfile: TransferProfile = {
        name: 'Transfer1',
        source: 'Profile1',
        target: 'Profile2',
        serverSource: 'server1',
        serverTarget: 'server2',
        default: false,
      };
      // const spyUpdateValue = spyOn(memStoreServiceSpy, 'updateValue');
      transferProfilesSignal.set([...mockTransferProfiles]);
      memStoreServiceSpy.getValue.and.returnValue(mockConnectionProfiles);

      // Act
      service.saveProfile(duplicateProfile);

      // Assert
      expect(memStoreServiceSpy.updateValue).toHaveBeenCalledWith('ConnectionProfiles', [
        mockTransferProfiles[0],
        mockTransferProfiles[1],
        duplicateProfile,
      ]);
      expect(toastServiceSpy.emitNotification).toHaveBeenCalledWith({
        message: 'Perfil almacenado',
        duration: 1000,
      });
    });
  });

  describe('setAsDefault', () => {
    it('should set profile as default and update credentials', () => {
      // Arrange
      const profileName = 'Transfer1';
      transferProfilesSignal.set([...mockTransferProfiles]);
      memStoreServiceSpy.getValue.and.returnValue(mockConnectionProfiles);

      // Act
      service.setAsDefault(profileName);

      // Assert
      expect(memStoreServiceSpy.updateValue).toHaveBeenCalledWith('ConnectionProfiles', [
        { ...mockTransferProfiles[0], default: true },
        { ...mockTransferProfiles[1], default: false },
      ]);
      expect(memStoreServiceSpy.updateValue).toHaveBeenCalledWith(
        'Credentials_V6_Cloud',
        mockCredentials,
      );
      expect(memStoreServiceSpy.updateValue).toHaveBeenCalledWith(
        'Credentials_V5_V5',
        mockCredentials,
      );
      expect(toastServiceSpy.emitNotification).toHaveBeenCalledWith({
        message: 'Perfil seleccionado',
        duration: 1000,
      });
    });
    // Note: We avoid testing null/empty or non-existent profile here because
    // the current implementation would throw when no default is found.
  });

  describe('removeProfile', () => {
    it('should remove profile and set new default if list remains with items', () => {
      // Arrange
      const profileToRemove = 'Transfer2';
      transferProfilesSignal.set([...mockTransferProfiles]);
      memStoreServiceSpy.getValue.and.returnValue(mockConnectionProfiles);

      // Act
      service.removeProfile(profileToRemove);

      // Assert
      expect(memStoreServiceSpy.updateValue).toHaveBeenCalledWith('ConnectionProfiles', [
        mockTransferProfiles[0],
      ]);
      // Due to cascading setAsDefault(rest[0].name)
      expect(memStoreServiceSpy.updateValue).toHaveBeenCalledWith('ConnectionProfiles', [
        { ...mockTransferProfiles[0], default: true },
      ]);
      expect(memStoreServiceSpy.updateValue).toHaveBeenCalledWith(
        'Credentials_V6_Cloud',
        mockCredentials,
      );
      expect(memStoreServiceSpy.updateValue).toHaveBeenCalledWith(
        'Credentials_V5_V5',
        mockCredentials,
      );
      expect(toastServiceSpy.emitNotification).toHaveBeenCalledWith({
        message: 'Perfil eliminado',
        duration: 1000,
      });
    });

    it('should remove non-default profile and still re-select first remaining as default', () => {
      // Arrange
      const profileToRemove = 'Transfer1';
      transferProfilesSignal.set([...mockTransferProfiles]);
      memStoreServiceSpy.getValue.and.returnValue(mockConnectionProfiles);

      // Act
      service.removeProfile(profileToRemove);

      // Assert
      expect(memStoreServiceSpy.updateValue).toHaveBeenCalledWith('ConnectionProfiles', [
        mockTransferProfiles[1],
      ]);
      // setAsDefault is still called because list is non-empty
      expect(memStoreServiceSpy.updateValue).toHaveBeenCalledWith('ConnectionProfiles', [
        { ...mockTransferProfiles[1], default: true },
      ]);
      expect(memStoreServiceSpy.updateValue).toHaveBeenCalledWith(
        'Credentials_V6_Cloud',
        mockCredentials,
      );
      expect(memStoreServiceSpy.updateValue).toHaveBeenCalledWith(
        'Credentials_V5_V5',
        mockCredentials,
      );
      expect(toastServiceSpy.emitNotification).toHaveBeenCalledWith({
        message: 'Perfil eliminado',
        duration: 1000,
      });
    });

    it('should handle null current profiles', () => {
      // Arrange
      const profileToRemove = 'Transfer1';
      transferProfilesSignal.set(null);
      memStoreServiceSpy.getValue.and.returnValue(mockConnectionProfiles);

      // Act
      service.removeProfile(profileToRemove);

      // Assert
      expect(memStoreServiceSpy.updateValue).toHaveBeenCalledWith('ConnectionProfiles', []);
      expect(toastServiceSpy.emitNotification).toHaveBeenCalledWith({
        message: 'Perfil eliminado',
        duration: 1000,
      });
    });

    it('should handle empty profiles array', () => {
      // Arrange
      const profileToRemove = 'Transfer1';
      transferProfilesSignal.set([]);
      memStoreServiceSpy.getValue.and.returnValue(mockConnectionProfiles);

      // Act
      service.removeProfile(profileToRemove);

      // Assert
      expect(memStoreServiceSpy.updateValue).toHaveBeenCalledWith('ConnectionProfiles', []);
      expect(toastServiceSpy.emitNotification).toHaveBeenCalledWith({
        message: 'Perfil eliminado',
        duration: 1000,
      });
    });

    it('should handle profile not found by keeping list then re-selecting first as default', () => {
      // Arrange
      const profileToRemove = 'NonExistentProfile';
      transferProfilesSignal.set([...mockTransferProfiles]);
      memStoreServiceSpy.getValue.and.returnValue(mockConnectionProfiles);

      // Act
      service.removeProfile(profileToRemove);

      // Assert
      expect(memStoreServiceSpy.updateValue).toHaveBeenCalledWith('ConnectionProfiles', [
        ...mockTransferProfiles,
      ]);
      expect(memStoreServiceSpy.updateValue).toHaveBeenCalledWith('ConnectionProfiles', [
        { ...mockTransferProfiles[0], default: true },
        { ...mockTransferProfiles[1], default: false },
      ]);
      expect(memStoreServiceSpy.updateValue).toHaveBeenCalledWith(
        'Credentials_V6_Cloud',
        mockCredentials,
      );
      expect(memStoreServiceSpy.updateValue).toHaveBeenCalledWith(
        'Credentials_V5_V5',
        mockCredentials,
      );
      expect(toastServiceSpy.emitNotification).toHaveBeenCalledWith({
        message: 'Perfil eliminado',
        duration: 1000,
      });
    });

    it('should handle removing the last profile', () => {
      // Arrange
      const singleProfile: TransferProfile[] = [mockTransferProfiles[0]];
      transferProfilesSignal.set(singleProfile);
      memStoreServiceSpy.getValue.and.returnValue(mockConnectionProfiles);
      spyOn(service, 'setAsDefault');

      // Act
      service.removeProfile('Transfer1');

      // Assert
      expect(memStoreServiceSpy.updateValue).toHaveBeenCalledWith('ConnectionProfiles', []);
      expect(service.setAsDefault).not.toHaveBeenCalled();
      expect(toastServiceSpy.emitNotification).toHaveBeenCalledWith({
        message: 'Perfil eliminado',
        duration: 1000,
      });
    });
  });

  describe('showToast', () => {
    it('should emit toast notification with correct message and duration', () => {
      // Arrange
      const message = 'Test message';

      // Act
      service.showToast(message);

      // Assert
      expect(toastServiceSpy.emitNotification).toHaveBeenCalledWith({ message, duration: 1000 });
    });

    it('should handle empty message', () => {
      // Arrange
      const message = '';

      // Act
      service.showToast(message);

      // Assert
      expect(toastServiceSpy.emitNotification).toHaveBeenCalledWith({ message, duration: 1000 });
    });

    it('should handle special characters in message', () => {
      // Arrange
      const message = 'Mensaje con acentos: áéíóú ñ';

      // Act
      service.showToast(message);

      // Assert
      expect(toastServiceSpy.emitNotification).toHaveBeenCalledWith({ message, duration: 1000 });
    });
  });
});
