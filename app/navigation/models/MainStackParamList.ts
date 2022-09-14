import { NavigatorScreenParams } from '@react-navigation/native';

import { MainBottomTabParamList } from './MainBottomTabParamList';
import { GlobalParamList } from './GlobalParamList';

export type MainStackParamList = {
  MainBottomTabNavigator: NavigatorScreenParams<MainBottomTabParamList>;
  // BusinessDetailTabNavigator: NavigatorScreenParams<BusinessDetailBottomTabParamList>;
  BusinessDetailTabNavigator: { id: string };
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
  Place: undefined;
  Walkthrough: { lastRoute: keyof GlobalParamList; id: string };
  SignUp: undefined;
  SignIn: undefined;
  Notification: undefined;
  Messenger: undefined;
  Messages: undefined;
  ResetPassword: undefined;
  ChangePassword: undefined;
  ProfileEdit: undefined;
  ChangeLanguage: undefined;
  ContactUs: undefined;
  AboutUs: undefined;
  Address: undefined;
  Hours: undefined;
  PriceRange: undefined;
  FinalReview: undefined;
  Gallery: undefined;
  MyBusinesses: undefined;
  EditBusiness: undefined;
  VerifyCode: undefined;
};
