import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveTheme = async (theme: string) => {
  await AsyncStorage.setItem('theme', theme);
};

export const saveThemeMode = async (
  themeMode: 'light' | 'dark' | 'dynamic',
) => {
  await AsyncStorage.setItem('themeMode', themeMode);
};

export const onChangeFont = async (font: string) => {
  await AsyncStorage.setItem('font', font);
};
