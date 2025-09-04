import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalDataService {
  storeValue<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getValue<T>(key: string): T | null {
    var local = localStorage.getItem(key);
    if (!local) {
      return null;
    }
    try {
      const value: T = JSON.parse(local);
      return value;
    } catch (err) {
      return null;
    }
  }

  clear(key: string): void {
    localStorage.removeItem(key);
  }

  empty(): void {
    localStorage.clear();
  }
}
