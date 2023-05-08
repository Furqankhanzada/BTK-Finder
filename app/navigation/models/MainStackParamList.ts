import { NavigatorScreenParams } from '@react-navigation/native';

import { MainBottomTabParamList } from './MainBottomTabParamList';
import { AuthParamList } from './AuthParamList';

export type MainStackParamList = {
  MainBottomTabNavigator: NavigatorScreenParams<MainBottomTabParamList>;
  BusinessDetailTabNavigator: { businessId: string };
  AuthStackNavigator: NavigatorScreenParams<AuthParamList>;
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
  Messenger: undefined;
  Messages: undefined;
};
