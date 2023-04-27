import { create } from 'zustand';

export type AuthStoreStates = {
  isLogin?: boolean;
};

export type AuthStoreActions = {
  setIsLogin: (isLogin: boolean) => void;
};

const initialState: AuthStoreStates = {
  isLogin: false,
};

const useAuthStore = create<AuthStoreStates & AuthStoreActions>((set) => ({
  ...initialState,

  setIsLogin: (isLogin) => set(() => ({ isLogin })),
}));

export default useAuthStore;
