import AsyncStorage from '@react-native-async-storage/async-storage';

export const onChangeTheme = async (theme: string) => {
  await AsyncStorage.setItem('theme', theme);
};

export const onChangeThemeMode = async (themeMode: string) => {
  await AsyncStorage.setItem('themeMode', themeMode);
};

export const onChangeFont = async (font: string) => {
  await AsyncStorage.setItem('font', font);
};
