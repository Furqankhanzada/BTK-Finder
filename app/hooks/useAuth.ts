import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useProfile } from '@screens/settings/profile/queries/queries';
import useAuthStore from '@screens/auth/store/Store';

export default function useAuth() {
  const { setUser, setIsLogin } = useAuthStore();
  const { data: user } = useProfile();

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        setIsLogin(true);
      }
    };
    getToken();
  }, [setIsLogin]);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [setUser, user]);
}
