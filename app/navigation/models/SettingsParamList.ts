import { NavigatorScreenParams } from '@react-navigation/native';
import { MyBusinessesStackParamList } from './MyBusinessesParamList';

export type SettingsParamList = {
  Settings: undefined;
  EditProfile: undefined;
  AboutUs: undefined;
  ContactUs: undefined;
  MyBusinessesStack: NavigatorScreenParams<MyBusinessesStackParamList>;
  SendNotification: undefined;
  Appearance: undefined;
  MyMemberships: undefined;
  PaymentsDetails: {
    invoiceId: string;
    packageName: string;
    training: string;
    amount: string;
    date: string;
  };

  // Memberships: undefined;
};
