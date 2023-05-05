import { useQuery } from '@tanstack/react-query';
import { handleError } from '@utils';
import useAuthStore from '@screens/auth/store/Store';
import { GET_PROFILE } from '../../../../constants';
import { UserPresentable } from '../models/UserPresentable';
import axiosApiInstance from '../../../../interceptor/axios-interceptor';

export const useProfile = () => {
  const { isLogin } = useAuthStore();

  return useQuery(
    ['profile'],
    (): Promise<UserPresentable> => {
      return axiosApiInstance({
        method: 'GET',
        url: GET_PROFILE,
      })
        .then((response) => response.data)
        .catch(({ response }) => {
          handleError(response.data);
        });
    },
    {
      enabled: isLogin,
      select: (data) => {
        return { ...data };
      },
    },
  );
};
