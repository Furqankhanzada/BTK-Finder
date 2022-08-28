import Config from 'react-native-config';

import axiosApiInstance from '../../../interceptor/axios-interceptor';

export const fetchBusinessCatagory = () => {
  return axiosApiInstance({
    method: 'GET',
    url: `${Config.API_URL}/categories`,
  });
};
