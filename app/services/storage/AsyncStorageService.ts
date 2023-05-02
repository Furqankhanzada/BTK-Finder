import { Storage, LocalStorageKeys } from './models/LocalStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class AsyncStorageService implements Storage {
  getItem<T extends string>(key: LocalStorageKeys): Promise<T | null> {
    return AsyncStorage.getItem(key) as Promise<T | null>;
  }
  setItem<V extends string>(key: LocalStorageKeys, value: V): Promise<void> {
    return AsyncStorage.setItem(key, value);
  }
}

export default function useLocalStorage() {
  const { getItem, setItem } = new AsyncStorageService();
  return {
    getItem,
    setItem,
  };
}
