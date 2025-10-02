import { computed, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { Credentials } from '../../types/models/Credentials';

export type StorageKey = 'Profiles' | 'Credentials_V5_V5' | 'Credentials_V6_Cloud' | string;

export interface StorageKeyTypes {
  Profiles: { name: string; credential: Credentials }[]; // Reemplaza 'any' con el tipo real de Profiles
  Credentials_V5_V5: Credentials; // Reemplaza 'any' con el tipo real de Credentials_V5_V5
  Credentials_V6_Cloud: Credentials; // Reemplaza 'any' con el tipo real de Credentials_V6_Cloud
  [key: string]: unknown; // Para otras claves genéricas
}

@Injectable({
  providedIn: 'root',
})
export class MemStoreService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly storeSignals = new Map<string, WritableSignal<any>>();

  private getSignal<T>(key: StorageKey): WritableSignal<T | null> {
    if (!this.storeSignals.has(key)) {
      const initial = this.getValue<T>(key);
      this.storeSignals.set(key, signal<T | null>(initial));
    }
    return this.storeSignals.get(key)!;
  }

  storeValue<T>(key: StorageKey, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
    this.getSignal<T>(key).set(value);
  }

  getValue<T>(key: StorageKey): T | null {
    const local = localStorage.getItem(key);
    if (!local) return null;
    try {
      return JSON.parse(local) as T;
    } catch {
      return null;
    }
  }

  signalOf<T>(key: StorageKey): WritableSignal<T | null> {
    return this.getSignal<T>(key);
  }

  observeKeys<T extends Record<string, StorageKey>>(
    keys: T,
  ): Signal<{
    [K in keyof T]: StorageKeyTypes[T[K]] | null;
  }> {
    return computed(() => {
      const result: Partial<{
        [K in keyof T]: StorageKeyTypes[T[K]] | null;
      }> = {};
      for (const prop in keys) {
        const k = keys[prop];
        result[prop] = this.getSignal<StorageKeyTypes[typeof k]>(k)();
      }
      return result as { [K in keyof T]: StorageKeyTypes[T[K]] | null };
    });
  }

  clear(key: StorageKey): void {
    localStorage.removeItem(key);
  }

  updateValue<T>(key: StorageKey, value: T): void {
    this.clear(key);
    this.storeValue(key, value);
  }

  empty(): void {
    localStorage.clear();
  }
}
