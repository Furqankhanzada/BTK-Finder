import { NavigatorScreenParams } from '@react-navigation/native';
import { NewBusinessParamList } from './NewBusinessParamList';

export type EditBusinessStackParamList = {
  EditBusiness: { businessId: string };
  Edit: NavigatorScreenParams<NewBusinessParamList>;
};
