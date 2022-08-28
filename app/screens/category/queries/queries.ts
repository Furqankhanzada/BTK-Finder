import Config from 'react-native-config';
import { useQuery } from '@tanstack/react-query';

import axiosApiInstance from '../../../interceptor/axios-interceptor';

export const fetchBusinessCatagory = () => {
  return axiosApiInstance({
    method: 'GET',
    url: `${Config.API_URL}/categories`,
  });
};

export const useCatagoryQuery = () => {
  return useQuery(['business-catagories'], fetchBusinessCatagory);
};
