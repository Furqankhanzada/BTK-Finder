import { create } from 'zustand';

export type AppearanceStoreStates = {
  theme?: string;
  themeMode?: string;
  font?: string;
};

export type AppearanceStoreActions = {
  setTheme: (theme: string) => void;
  setThemeMode: (themeMode: 'light' | 'dark' | 'dynamic') => void;
  setFont: (font: string) => void;
};

const initialState: AppearanceStoreStates = {
  font: 'Raleway',
};

const useAppStore = create<AppearanceStoreStates & AppearanceStoreActions>(
  (set) => ({
    ...initialState,

    setTheme: (theme) => set(() => ({ theme })),
    setThemeMode: (themeMode) => set(() => ({ themeMode })),
    setFont: (font) => set(() => ({ font })),
  }),
);

export default useAppStore;
