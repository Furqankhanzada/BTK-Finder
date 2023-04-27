import AsyncStorage from '@react-native-async-storage/async-storage';
import { Font, ThemeMode } from 'store/models/appStore';

export const saveTheme = async (theme: string) => {
  await AsyncStorage.setItem('theme', theme);
};

export const saveThemeMode = async (themeMode: ThemeMode) => {
  await AsyncStorage.setItem('themeMode', themeMode);
};

export const saveFont = async (font: Font) => {
  await AsyncStorage.setItem('font', font);
};
