import { NavigatorScreenParams } from '@react-navigation/native';

import { DashboardParamList } from './DashboardParamList';
import { SettingsParamList } from './SettingsParamList';

export type MainBottomTabParamList = {
  DashboardStack: NavigatorScreenParams<DashboardParamList>;
  Favourite: undefined;
  Business: undefined;
  SettingsStack: NavigatorScreenParams<SettingsParamList>;
};
