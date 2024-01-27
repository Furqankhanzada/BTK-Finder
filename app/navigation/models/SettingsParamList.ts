import { NavigatorScreenParams } from '@react-navigation/native';

import { MyBusinessesStackParamList } from './MyBusinessesParamList';
import { MyMembershipsStackParamList } from './MyMembershipsStackParamList';

export type SettingsParamList = {
  Settings: undefined;
  EditProfile: undefined;
  AboutUs: undefined;
  ContactUs: undefined;
  MyBusinessesStack: NavigatorScreenParams<MyBusinessesStackParamList>;
  SendNotification: undefined;
  Appearance: undefined;
  MyMembershipsStack: NavigatorScreenParams<MyMembershipsStackParamList>;
  Invoices: {
    businessId: string;
  };
};
