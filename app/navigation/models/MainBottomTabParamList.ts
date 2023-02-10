import { NavigatorScreenParams } from '@react-navigation/native';

import { DashboardParamList } from './DashboardParamList';

export type MainBottomTabParamList = {
  DashboardStack: NavigatorScreenParams<DashboardParamList>;
  Favourite: undefined;
  Business: undefined;
  Welcome: undefined;
};
