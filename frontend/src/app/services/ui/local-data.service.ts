import { Injectable } from '@angular/core';

export type StorageKey = 'Profiles' | string;

@Injectable({
  providedIn: 'root',
})
export class LocalDataService {
  storeValue<T>(key: StorageKey, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getValue<T>(key: StorageKey): T | null {
    const local = localStorage.getItem(key);
    if (!local) {
      return null;
    }
    try {
      const value: T = JSON.parse(local);
      return value;
    } catch {
      return null;
    }
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
