import { RootStackParamList } from './RootStackParamList';
import { MainStackParamList } from './MainStackParamList';
import { MainBottomTabParamList } from './MainBottomTabParamList';
import {
  BusinessDetailBottomTabParamList,
  ReviewStackParamList,
} from './BusinessDetailBottomTabParamList';
import { DashboardParamList } from './DashboardParamList';
import { SettingsParamList } from './SettingsParamList';
import { AuthParamList } from './AuthParamList';

export type GlobalParamList = RootStackParamList &
  MainStackParamList &
  MainBottomTabParamList &
  BusinessDetailBottomTabParamList &
  ReviewStackParamList &
  DashboardParamList &
  SettingsParamList &
  AuthParamList;
