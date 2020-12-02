import { useState, useEffect } from 'react';
import { useAsyncStorage } from '@react-native-community/async-storage';

export default function useIsLogin() {
    const { getItem } = useAsyncStorage('access_token');
    const [token, setToken] = useState(null);
    async function getToken() {
        const accessToken = await getItem();
        setToken(accessToken);
    }
    
    useEffect(() => {
        getToken()
    })

  return !!token;
}