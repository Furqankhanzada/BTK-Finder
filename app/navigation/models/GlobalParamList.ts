import { RootStackParamList } from './RootStackParamList';
import { MainStackParamList } from './MainStackParamList';
import { MainBottomTabParamList } from './MainBottomTabParamList';
import {
  BusinessDetailBottomTabParamList,
  ReviewStackParamList,
} from './BusinessDetailBottomTabParamList';
import { DashboardParamList } from './DashboardParamList';
import { NewBusinessParamList } from './NewBusinessParamList';
import { SettingsParamList } from './SettingsParamList';
import { AuthParamList } from './AuthParamList';
import { MyBusinessesStackParamList } from './MyBusinessesParamList';

export type GlobalParamList = RootStackParamList &
  MainStackParamList &
  MainBottomTabParamList &
  BusinessDetailBottomTabParamList &
  ReviewStackParamList &
  DashboardParamList &
  NewBusinessParamList &
  SettingsParamList &
  AuthParamList &
  MyBusinessesStackParamList;
