import { create } from 'zustand';

export type AuthStoreTypes = {
  isLogin?: boolean;
};

export type AuthStoreActions = {
  setIsLogin: (isLogin: boolean) => void;
};

const initialState: AuthStoreTypes = {
  isLogin: false,
};

const useAuthStore = create<AuthStoreTypes & AuthStoreActions>((set) => ({
  ...initialState,

  setIsLogin: (isLogin) => set(() => ({ isLogin })),
}));

export default useAuthStore;
