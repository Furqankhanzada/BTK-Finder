import { create } from 'zustand';

export type AppearanceStoreTypes = {
  theme?: string;
  themeMode?: string;
  font?: string;
};

export type AppearanceStoreActions = {
  setTheme: (theme: string) => void;
  setThemeMode: (themeMode: string) => void;
  setFont: (font: string) => void;
};

const initialState: AppearanceStoreTypes = {
  font: 'Raleway',
};

const useAppStore = create<AppearanceStoreTypes & AppearanceStoreActions>(
  (set) => ({
    ...initialState,

    setTheme: (theme) => set(() => ({ theme })),
    setThemeMode: (themeMode) => set(() => ({ themeMode })),
    setFont: (font) => set(() => ({ font })),
  }),
);

export default useAppStore;
