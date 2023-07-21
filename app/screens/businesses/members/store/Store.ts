import { create } from 'zustand';

export type AuthStoreStates = {
  selectedPackage: string;
};

export type AuthStoreActions = {
  setSelectedPackage: (isLogin: string) => void;
};

const initialState: AuthStoreStates = {
  selectedPackage: '',
};

const useMemberStore = create<AuthStoreStates & AuthStoreActions>((set) => ({
  ...initialState,

  setSelectedPackage: (selectedPackage) => set(() => ({ selectedPackage })),
}));

export default useMemberStore;
