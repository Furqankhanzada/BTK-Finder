import { useEffect } from 'react';

import { useProfile } from '@screens/settings/profile/queries/queries';
import useAuthStore from '@screens/auth/store/Store';

export default function useAuth() {
  const { setUser, setIsLogin } = useAuthStore();
  const { data: user } = useProfile();

  useEffect(() => {
    if (user) {
      setUser(user);
      setIsLogin(true);
    }
  }, [setIsLogin, setUser, user]);
}
