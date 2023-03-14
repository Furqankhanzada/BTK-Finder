import { create } from 'zustand';

export type AuthStoreTypes = {
  isLogin?: boolean;
};

export type AuthStoreActions = {
  setLogin: (isLogin: boolean) => void;
};

const initialState: AuthStoreTypes = {
  isLogin: false,
};

const useAuthStore = create<AuthStoreTypes & AuthStoreActions>((set) => ({
  ...initialState,

  setLogin: (isLogin) => set(() => ({ isLogin })),
}));

export default useAuthStore;
