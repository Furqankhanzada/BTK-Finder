import { create } from 'zustand';
import { ThemeMode } from './models/appStore';

export type AppStoreStates = {
  theme?: string;
  themeMode?: string;
  font?: string;
};

export type AppStoreActions = {
  setTheme: (theme: string) => void;
  setThemeMode: (themeMode: ThemeMode) => void;
  setFont: (font: string) => void;
};

const initialState: AppStoreStates = {
  font: 'Raleway',
};

const useAppStore = create<AppStoreStates & AppStoreActions>((set) => ({
  ...initialState,

  setTheme: (theme) => set(() => ({ theme })),
  setThemeMode: (themeMode) => set(() => ({ themeMode })),
  setFont: (font) => set(() => ({ font })),
}));

export default useAppStore;
