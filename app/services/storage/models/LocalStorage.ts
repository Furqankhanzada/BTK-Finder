export enum LocalStorageKeys {
  NATIVE_UPDATE_VERSION = 'native_update_version',
  THEME = 'theme',
  THEME_MODE = 'themeMode',
  FONT = 'font',
}

export interface Storage {
  setItem(key: LocalStorageKeys, value: string): Promise<void | null>;
  getItem(key: LocalStorageKeys): Promise<string | null>;
}
