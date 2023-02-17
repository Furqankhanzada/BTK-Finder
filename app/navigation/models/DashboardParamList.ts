import { NavigatorScreenParams } from '@react-navigation/native';
import { NotificationParamList } from './NotificationParamList';

export type DashboardParamList = {
  Dashboard: undefined;
  HelpLine: undefined;
  NotificationStack: NavigatorScreenParams<NotificationParamList>;
};
