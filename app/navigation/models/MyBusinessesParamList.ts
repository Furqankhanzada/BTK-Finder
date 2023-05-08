import { NavigatorScreenParams } from '@react-navigation/native';
import { NewBusinessParamList } from './NewBusinessParamList';

export type MyBusinessesStackParamList = {
  MyBusinesses: undefined;
  MyBusiness: { businessId: string };
  Edit: NavigatorScreenParams<NewBusinessParamList>;
};
