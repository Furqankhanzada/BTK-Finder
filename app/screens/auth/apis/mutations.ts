import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from '@tanstack/react-query';

import { handleError } from '@utils';
import { useAlerts } from '@hooks';
import { BaseColor } from '@config';
import { UserPresentable } from '@screens/settings/profile/models/UserPresentable';

import axiosApiInstance from '../../../interceptor/axios-interceptor';
import useAuthStore, { AuthStoreActions } from '../store/Store';
import { IconName } from '../../../contexts/alerts-v2/models/Icon';
import {
  SIGNUP,
  LOGIN,
  RESET_PASSWORD,
  VERIFY_CODE,
  CHANGE_PASSWORD,
} from '../../../constants';

type RegisterPayload = {
  name: string;
  phone: string;
  email: string;
  password: string;
};

type LoginResponse = {
  access_token: string;
};

type LoginPayload = {
  username: string;
  password: string;
};

type ResetPasswordPayload = {
  emailOrNumber: string;
};

type VerifyCodePayload = {
  code: string;
  emailOrNumber: string | number;
};

type VerifyCodeResponse = {
  access_token: string;
};

type ChangePasswordPayload = {
  password: string;
};

export const useRegisterAccount = () => {
  const { showNotification } = useAlerts();

  return useMutation<UserPresentable, Error, RegisterPayload>((payload) => {
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

export const useResetPassword = () => {
  const { showNotification } = useAlerts();

  return useMutation<{}, Error, ResetPasswordPayload>((payload) => {
    return axiosApiInstance({
      method: 'POST',
      url: RESET_PASSWORD,
      data: payload,
    })
      .then(async (response) => {
        showNotification({
          icon: {
            size: 70,
            name: IconName.CheckMarkCircle,
            color: BaseColor.greenColor,
          },
          message: 'A verification code is sent on your provided email/phone',
        });
        return response.data;
      })
      .catch(({ response }) => {
        handleError(response.data);
      });
  });
};

export const useCodeVerification = () => {
  const setLogin = useAuthStore((state: AuthStoreActions) => state.setLogin);

  return useMutation<VerifyCodeResponse, Error, VerifyCodePayload>(
    (payload) => {
      return axiosApiInstance({
        method: 'POST',
        url: VERIFY_CODE,
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
    },
  );
};

export const useChangePassword = () => {
  const { showNotification } = useAlerts();

  return useMutation<any, Error, ChangePasswordPayload>((payload) => {
    return axiosApiInstance({
      method: 'POST',
      url: CHANGE_PASSWORD,
      data: payload,
    })
      .then(async (response) => {
        showNotification({
          icon: {
            size: 70,
            name: IconName.CheckMarkCircle,
            color: BaseColor.greenColor,
          },
          message: 'You have successfully changed your password',
        });
        return response.data;
      })
      .catch(({ response }) => {
        handleError(response.data);
      });
  });
};
