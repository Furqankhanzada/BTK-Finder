import { NavigatorScreenParams } from '@react-navigation/native';

import { MainBottomTabParamList } from './MainBottomTabParamList';
import { GlobalParamList } from './GlobalParamList';
import { EditBusinessStackParamList } from './EditBusinessStackParamList';

export type MainStackParamList = {
  MainBottomTabNavigator: NavigatorScreenParams<MainBottomTabParamList>;
  BusinessDetailTabNavigator: { businessId: string };
  ThemeSetting: undefined;
  Setting: undefined;
  Category: undefined;
  Businesses: {
    title: string;
    search?: string;
    isFiltering?: boolean;
    popular?: boolean;
    recent?: boolean;
    tags?: string | string[];
    category?: string | string[];
    latitude?: number;
    longitude?: number;
  };
  Walkthrough: { lastRoute: keyof GlobalParamList; id: string };
  SignUp: undefined;
  SignIn: undefined;
  Messenger: undefined;
  Messages: undefined;
  ResetPassword: undefined;
  ChangePassword: undefined;
  ProfileEdit: undefined;
  ChangeLanguage: undefined;
  ContactUs: undefined;
  AboutUs: undefined;
  MyBusinesses: undefined;
  EditBusinessStack: NavigatorScreenParams<EditBusinessStackParamList>;
  VerifyCode: undefined;
  SendNotification: undefined;
};
