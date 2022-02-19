import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { share } from 'rxjs/operators';

const enum LocStorageKey {
  // our
  userData = 'user_data',
  // reserved
  syncKeys = 'sync_keys',
  addToSyncKeys = 'addToSyncKeys',
  removeFromSyncKeys = 'removeFromSyncKeys',
  getSessionStorage = 'getSessionStorage',
  setSessionStorage = 'setSessionStorage',
  addToSessionStorage = 'addToSessionStorage',
  removeFromSessionStorage = 'removeFromSessionStorage',
  clearAllSessionsStorage = 'clearAllSessionsStorage',
}

@Injectable({
  providedIn: 'root',
})
export class LocalStorageManager {
  private static syncListenerInitialized = false;

  private syncKeys: string[] = [];
  private initEvent$ = new Subject<void>();

  private reservedKeys: string[] = [
    LocStorageKey.syncKeys,
    LocStorageKey.addToSyncKeys,
    LocStorageKey.removeFromSyncKeys,
    LocStorageKey.getSessionStorage,
    LocStorageKey.setSessionStorage,
    LocStorageKey.addToSessionStorage,
    LocStorageKey.removeFromSessionStorage,
    LocStorageKey.clearAllSessionsStorage,
  ];

  initializeStorageSyncListener(): void {
    if (LocalStorageManager.syncListenerInitialized === true) {
      return;
    }

    LocalStorageManager.syncListenerInitialized = true;
    window.addEventListener('storage', this.sessionStorageTransferHandler, false);
    this.syncSessionStorage();
  }

  removeStorageSyncListener(): void {
    window.removeEventListener('storage', this.sessionStorageTransferHandler, false);
    LocalStorageManager.syncListenerInitialized = false;
  }

  clearAllStorage(): void {
    this.clearAllSessionsStorage();
    this.clearLocalStorage();
  }

  clearAllSessionsStorage(): void {
    this.clearInstanceSessionStorage();
    localStorage.removeItem(LocStorageKey.syncKeys);

    localStorage.setItem(LocStorageKey.clearAllSessionsStorage, '_dummy');
    localStorage.removeItem(LocStorageKey.clearAllSessionsStorage);
  }

  clearInstanceSessionStorage(): void {
    sessionStorage.clear();
    this.syncKeys = [];
  }

  clearLocalStorage(): void {
    localStorage.clear();
  }

  saveSessionData(data: unknown, key: string = LocStorageKey.userData): void{
    this.testForInvalidKeys(key);

    this.removeFromSyncKeys(key);
    localStorage.removeItem(key);
    this.sessionStorageSetItem(key, data);
  }

  saveSyncedSessionData(data: unknown, key: string = LocStorageKey.userData): void {
    this.testForInvalidKeys(key);

    localStorage.removeItem(key);
    this.addToSessionStorage(data, key);
  }

  savePermanentData(data: unknown, key: string = LocStorageKey.userData): void {
    this.testForInvalidKeys(key);

    this.removeFromSessionStorage(key);
    this.localStorageSetItem(key, data);
  }

  moveDataToSessionStorage(key: string = LocStorageKey.userData): void {
    this.testForInvalidKeys(key);

    const data = this.getData(key);

    if (data == null) {
      return;
    }

    this.saveSessionData(data, key);
  }

  moveDataToSyncedSessionStorage(key: string = LocStorageKey.userData): void {
    this.testForInvalidKeys(key);

    const data = this.getData(key);

    if (data == null) {
      return;
    }

    this.saveSyncedSessionData(data, key);
  }

  moveDataToPermanentStorage(key: string = LocStorageKey.userData): void {
    this.testForInvalidKeys(key);

    const data = this.getData(key);

    if (data == null) {
      return;
    }

    this.savePermanentData(data, key);
  }

  exists(key: string = LocStorageKey.userData): boolean {
    let data = sessionStorage.getItem(key);

    if (data == null) {
      data = localStorage.getItem(key);
    }

    return data != null;
  }

  getData(key: string = LocStorageKey.userData): unknown {
    this.testForInvalidKeys(key);

    let data = this.sessionStorageGetItem(key);

    if (data == null) {
      data = this.localStorageGetItem(key);
    }

    return data;
  }

  getDataObject<T>(key: string = LocStorageKey.userData, isDateType = false): T | null {
    let data = this.getData(key);

    if (data == null) {
      return null;
    }

    if (isDateType) {
      data = new Date(data as string | number | Date);
    }
    return data as T;
  }

  deleteData(key: string = LocStorageKey.userData): void {
    this.testForInvalidKeys(key);

    this.removeFromSessionStorage(key);
    localStorage.removeItem(key);
  }

  onInitEvent(): Observable<void> {
    return this.initEvent$.pipe(share());
  }

  private sessionStorageTransferHandler = (event: StorageEvent) => {
    if (!event.newValue) {
      return;
    }

    switch (event.key) {
      case LocStorageKey.getSessionStorage: {
        if (sessionStorage.length) {
          this.localStorageSetItem(LocStorageKey.setSessionStorage, sessionStorage);
          localStorage.removeItem(LocStorageKey.setSessionStorage);
        }
        break;
      }

      case LocStorageKey.setSessionStorage: {
        if (!this.syncKeys.length) {
          this.loadSyncKeys();
        }

        const data = JSON.parse(event.newValue);
        for (const key in data) {
          if (this.syncKeysContains(key)) {
            this.sessionStorageSetItem(key, JSON.parse(data[key]));
          }
        }

        this.onInit();
        break;
      }

      case LocStorageKey.addToSessionStorage: {
        const data = JSON.parse(event.newValue);
        this.addToSessionStorageHelper(data.data, data.key);
        break;
      }

      case LocStorageKey.removeFromSessionStorage: {
        this.removeFromSessionStorageHelper(event.newValue);
        break;
      }

      case LocStorageKey.clearAllSessionsStorage: {
        if (sessionStorage.length) {
          this.clearInstanceSessionStorage();
        }
        break;
      }

      case LocStorageKey.addToSyncKeys: {
        this.addToSyncKeysHelper(event.newValue);
        break;
      }

      case LocStorageKey.removeFromSyncKeys: {
        this.removeFromSyncKeysHelper(event.newValue);
        break;
      }
    }
  }

  private syncSessionStorage(): void {
    localStorage.setItem(LocStorageKey.getSessionStorage, '_dummy');
    localStorage.removeItem(LocStorageKey.getSessionStorage);
  }

  private addToSessionStorage(data: unknown, key: string): void {
    this.addToSessionStorageHelper(data, key);
    this.addToSyncKeysBackup(key);

    this.localStorageSetItem(LocStorageKey.addToSessionStorage, { key, data });
    localStorage.removeItem(LocStorageKey.addToSessionStorage);
  }

  private addToSessionStorageHelper(data: unknown, key: string): void {
    this.addToSyncKeysHelper(key);
    this.sessionStorageSetItem(key, data);
  }

  private removeFromSessionStorage(keyToRemove: string): void {
    this.removeFromSessionStorageHelper(keyToRemove);
    this.removeFromSyncKeysBackup(keyToRemove);

    localStorage.setItem(LocStorageKey.removeFromSessionStorage, keyToRemove);
    localStorage.removeItem(LocStorageKey.removeFromSessionStorage);
  }

  private removeFromSessionStorageHelper(keyToRemove: string): void {
    sessionStorage.removeItem(keyToRemove);
    this.removeFromSyncKeysHelper(keyToRemove);
  }

  private testForInvalidKeys(key: string): void {
    if (!key) {
      throw new Error('Key cannot be empty');
    }

    if (this.reservedKeys.includes(key)) {
      throw new Error(`The storage key "${key}" is reserved and cannot be used. Please use a different key`);
    }
  }

  private syncKeysContains(key: string): boolean {
    return this.syncKeys.includes(key);
  }

  private loadSyncKeys(): void {
    if (this.syncKeys.length) {
      return;
    }

    this.syncKeys = this.getSyncKeysFromStorage();
  }

  private getSyncKeysFromStorage(defaultValue: string[] = []): string[] {
    const data = this.localStorageGetItem(LocStorageKey.syncKeys);

    if (data == null) {
      return defaultValue;
    } else {
      return data as string[];
    }
  }

  private addToSyncKeys(key: string): void {
    this.addToSyncKeysHelper(key);
    this.addToSyncKeysBackup(key);

    localStorage.setItem(LocStorageKey.addToSyncKeys, key);
    localStorage.removeItem(LocStorageKey.addToSyncKeys);
  }

  private addToSyncKeysBackup(key: string): void {
    const storedSyncKeys = this.getSyncKeysFromStorage();

    if (!storedSyncKeys.includes(key)) {
      storedSyncKeys.push(key);
      this.localStorageSetItem(LocStorageKey.syncKeys, storedSyncKeys);
    }
  }

  private removeFromSyncKeysBackup(key: string): void {
    const storedSyncKeys = this.getSyncKeysFromStorage();

    const index = storedSyncKeys.indexOf(key);

    if (index > -1) {
      storedSyncKeys.splice(index, 1);
      this.localStorageSetItem(LocStorageKey.syncKeys, storedSyncKeys);
    }
  }

  private addToSyncKeysHelper(key: string): void {
    if (!this.syncKeysContains(key)) {
      this.syncKeys.push(key);
    }
  }

  private removeFromSyncKeys(key: string): void {
    this.removeFromSyncKeysHelper(key);
    this.removeFromSyncKeysBackup(key);

    localStorage.setItem(LocStorageKey.removeFromSyncKeys, key);
    localStorage.removeItem(LocStorageKey.removeFromSyncKeys);
  }

  private removeFromSyncKeysHelper(key: string): void {
    const index = this.syncKeys.indexOf(key);

    if (index > -1) {
      this.syncKeys.splice(index, 1);
    }
  }

  private localStorageSetItem(key: string, data: unknown) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  private sessionStorageSetItem(key: string, data: unknown) {
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  private localStorageGetItem(key: string): unknown {
    return this.jsonTryParse(localStorage.getItem(key));
  }

  private sessionStorageGetItem(key: string): unknown {
    return this.jsonTryParse(sessionStorage.getItem(key));
  }

  private jsonTryParse(value: string | null): unknown {
    if (value) {
      try {
        return JSON.parse(value);
      } catch (e) {
        if (value === 'undefined') {
          return void 0;
        }
        return value;
      }
    }
    return void 0;
  }

  private onInit(): void {
    setTimeout(() => {
      this.initEvent$.next();
      this.initEvent$.complete();
    });
  }
}
