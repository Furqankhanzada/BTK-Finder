import axios from "axios";
import AsyncStorage from '@react-native-community/async-storage';

const axiosApiInstance = axios.create();

//Request Interceptor
axiosApiInstance.interceptors.request.use(
    async config => {
        const token = await AsyncStorage.getItem('access_token')
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        console.log('axiosApiInstance error', error)
        console.log('axiosApiInstance error.response', error.response)
        Promise.reject(error)
    }
);

export default axiosApiInstance;
