import { UserPresentable } from '@screens/settings/profile/models/UserPresentable';
import { create } from 'zustand';

export type AuthStoreStates = {
  isLogin?: boolean;
  user?: UserPresentable;
};

export type AuthStoreActions = {
  setIsLogin: (isLogin: boolean) => void;
  setUser: (user: UserPresentable) => void;
};

const initialState: AuthStoreStates = {
  isLogin: false,
};

const useAuthStore = create<AuthStoreStates & AuthStoreActions>((set) => ({
  ...initialState,

  setIsLogin: (isLogin) => set(() => ({ isLogin })),
  setUser: (user) => set(() => ({ user })),
}));

export default useAuthStore;
