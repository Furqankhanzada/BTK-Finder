import { NavigatorScreenParams } from '@react-navigation/native';

import { DashboardParamList } from './DashboardParamList';
import { SettingsParamList } from './SettingsParamList';

export type MainBottomTabParamList = {
  DashboardStack: NavigatorScreenParams<DashboardParamList>;
  Favourite: undefined;
  NewBusiness: undefined;
  SettingsStack: NavigatorScreenParams<SettingsParamList>;
};
