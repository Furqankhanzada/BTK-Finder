import { create } from 'zustand';
import { Font, ThemeMode } from './models/appStore';

export type AppStoreStates = {
  theme?: string;
  themeMode?: ThemeMode;
  font?: Font;
};

export type AppStoreActions = {
  setTheme: (theme: string) => void;
  setThemeMode: (themeMode: ThemeMode) => void;
  setFont: (font: Font) => void;
};

const initialState: AppStoreStates = {
  font: Font.Raleway,
};

const useAppStore = create<AppStoreStates & AppStoreActions>((set) => ({
  ...initialState,

  setTheme: (theme) => set(() => ({ theme })),
  setThemeMode: (themeMode) => set(() => ({ themeMode })),
  setFont: (font) => set(() => ({ font })),
}));

export default useAppStore;
