import { create } from 'zustand';
import { DefaultFont } from '@config';

export type AppearanceStoreTypes = {
  theme?: string;
  force_theme?: boolean;
  font?: string;
};

export type AppearanceStoreActions = {
  setTheme: (theme: string) => void;
  setForceTheme: (force_theme: boolean) => void;
  setFont: (font: string) => void;
};

const initialState: AppearanceStoreTypes = {
  font: DefaultFont,
};

const useAppStore = create<AppearanceStoreTypes & AppearanceStoreActions>(
  (set) => ({
    ...initialState,

    setTheme: (theme) => set(() => ({ theme })),
    setForceTheme: (force_theme) => set(() => ({ force_theme })),
    setFont: (font) => set(() => ({ font })),
  }),
);

export default useAppStore;
