import { Storage as UnStorage, StorageValue, createStorage } from 'unstorage';
import localStorageDriver from 'unstorage/drivers/localstorage';

export type StorageItemKey = 'lastUsedParameters';

class KVStorage {
  private readonly _instance: UnStorage;
  public constructor() {
    this._instance = createStorage({
      driver: localStorageDriver({ base: 'app:' }),
    });
  }

  public async get(key: StorageItemKey): Promise<StorageValue> {
    return this._instance.getItem(key);
  }

  public async set(key: StorageItemKey, value: StorageValue): Promise<void> {
    return this._instance.setItem(key, value);
  }
}

export const StorageInstance = new KVStorage();
