import AsyncStorage from '@react-native-async-storage/async-storage';

export const onChangeTheme = async (theme: string) => {
  await AsyncStorage.setItem('theme', theme);
};

export const onForceTheme = async (forceTheme: string) => {
  await AsyncStorage.setItem('force_theme', forceTheme);
};

export const onChangeFont = async (font: string) => {
  await AsyncStorage.setItem('font', font);
};
