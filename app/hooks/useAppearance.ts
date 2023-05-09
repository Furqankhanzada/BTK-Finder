import { useEffect } from 'react';

import useLocalStorage from '../services/storage/AsyncStorageService';
import { LocalStorageKeys } from '../services/storage/models/LocalStorage';
import useAppStore from '../store/appStore';
import { Font, ThemeMode } from '../store/models/appStore';

export default function useAppearance() {
  const { setThemeMode, setFont } = useAppStore();
  const { getItem } = useLocalStorage();

  useEffect(() => {
    const getDarkTheme = async () => {
      const themeMode = await getItem<ThemeMode>(LocalStorageKeys.THEME_MODE);
      if (themeMode) {
        setThemeMode(themeMode);
      }
    };
    getDarkTheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setThemeMode]);

  useEffect(() => {
    const getFont = async () => {
      const font = await getItem<Font>(LocalStorageKeys.FONT);
      if (font) {
        setFont(font);
      }
    };
    getFont();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setFont]);
}
