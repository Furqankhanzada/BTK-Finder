import { NavigatorScreenParams } from '@react-navigation/native';

import { MainBottomTabParamList } from './MainBottomTabParamList';
import { GlobalParamList } from './GlobalParamList';

export type MainStackParamList = {
  MainBottomTabNavigator: NavigatorScreenParams<MainBottomTabParamList>;
  BusinessDetailTabNavigator: { businessId: string };
  ThemeSetting: undefined;
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
  Address: undefined;
  Hours: undefined;
  PriceRange: undefined;
  FinalReview: undefined;
  Gallery: undefined;
  EditBusiness: undefined;
  VerifyCode: undefined;
};
