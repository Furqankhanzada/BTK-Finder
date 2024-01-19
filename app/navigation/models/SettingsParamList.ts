import { NavigatorScreenParams } from '@react-navigation/native';
import { MyBusinessesStackParamList } from './MyBusinessesParamList';
import { string } from 'yup/lib/locale';

export type SettingsParamList = {
  Settings: undefined;
  EditProfile: undefined;
  AboutUs: undefined;
  ContactUs: undefined;
  MyBusinessesStack: NavigatorScreenParams<MyBusinessesStackParamList>;
  SendNotification: undefined;
  Appearance: undefined;
  MyMemberships: undefined;
  Invoices: {
    businessId: string;
  };
};
