import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import useAppStore from '../store/appStore';
import { Font, ThemeMode } from '../store/models/appStore';

export default function useAppearance() {
  const { setThemeMode, setFont } = useAppStore();

  useEffect(() => {
    const getDarkTheme = async () => {
      const themeMode = (await AsyncStorage.getItem('themeMode')) as ThemeMode;
      if (themeMode) {
        setThemeMode(themeMode);
      }
    };
    getDarkTheme();
  }, [setThemeMode]);

  useEffect(() => {
    const getFont = async () => {
      const font = (await AsyncStorage.getItem('font')) as Font;
      if (font) {
        setFont(font);
      }
    };
    getFont();
  }, [setFont]);
}
