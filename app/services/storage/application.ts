import AsyncStorage from '@react-native-async-storage/async-storage';
import { Font, ThemeMode } from 'store/models/appStore';
import { LocalStorageKeys } from './models/LocalStorageKey';

export const saveTheme = async (theme: string) => {
  await AsyncStorage.setItem(LocalStorageKeys.THEME, theme);
};

export const saveThemeMode = async (themeMode: ThemeMode) => {
  await AsyncStorage.setItem(LocalStorageKeys.THEME_MODE, themeMode);
};

export const saveFont = async (font: Font) => {
  await AsyncStorage.setItem(LocalStorageKeys.FONT, font);
};
