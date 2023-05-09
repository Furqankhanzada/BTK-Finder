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
      const themeMode = (await getItem(
        LocalStorageKeys.THEME_MODE,
      )) as unknown as ThemeMode;
      if (themeMode) {
        setThemeMode(themeMode);
      }
    };
    getDarkTheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setThemeMode]);

  useEffect(() => {
    const getFont = async () => {
      const font = (await getItem(LocalStorageKeys.FONT)) as unknown as Font;
      if (font) {
        setFont(font);
      }
    };
    getFont();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setFont]);
}
