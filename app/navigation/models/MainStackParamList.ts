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
  Place: undefined | any;
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
  Address: undefined;
  Hours: undefined;
  PriceRange: undefined;
  FinalReview: undefined;
  Gallery: undefined;
  MyBusinesses: undefined;
  EditBusiness: undefined;
  VerifyCode: undefined;
  Latitude: Number[];
  Longtitude: Number[];
};
