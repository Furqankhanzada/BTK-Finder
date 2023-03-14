import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from '@tanstack/react-query';
import { handleError } from '@utils';
import { useAlerts } from '@hooks';
import { BaseColor } from '@config';

import { IconName } from '../../../contexts/alerts-v2/models/Icon';
import { SIGNUP, LOGIN } from '../../../constants';
import axios from 'axios';
import useAuthStore, { AuthStoreActions } from '../store/Store';

type LoginResponse = {
  access_token: string;
};

type LoginPayload = {
  username: string;
  password: string;
};

export const useRegisterAcctount = () => {
  const { showNotification } = useAlerts();

  return useMutation<any, Error, any>((payload) => {
    return axios({
      method: 'POST',
      url: SIGNUP,
      data: payload,
    })
      .then((response) => {
        showNotification({
          icon: {
            size: 70,
            name: IconName.CheckMarkCircle,
            color: BaseColor.greenColor,
          },
          message: 'You have successfully registered an account, Login Now!',
        });
        return response.data;
      })
      .catch(({ response }) => {
        handleError(response.data);
      });
  });
};

export const useLogin = () => {
  const setLogin = useAuthStore((state: AuthStoreActions) => state.setLogin);

  return useMutation<LoginResponse, Error, LoginPayload>((payload) => {
    return axios({
      method: 'POST',
      url: LOGIN,
      data: payload,
    })
      .then(async (response) => {
        try {
          await AsyncStorage.setItem(
            'access_token',
            response?.data?.access_token,
          );
          setLogin(true);
        } catch (e) {}
        return response.data;
      })
      .catch(({ response }) => {
        handleError(response.data);
      });
  });
};
