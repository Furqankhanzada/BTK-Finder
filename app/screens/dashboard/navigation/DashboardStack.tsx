import { createStackNavigator } from '@react-navigation/stack';

import React from 'react';
import { DashboardParamList } from '../../../navigation/models/DashboardParamList';
import HelpLine from '@screens/dashboard/helpline/HelplineScreen';
import DashboardScreen from '@screens/dashboard/DashboardScreen';
import NotificationsListScreen from '@screens/notification/list/NotificationsListScreen';
import NotificationInfoScreen from '@screens/notification/info/NotificationInfoScreen';

const DashboardStack = createStackNavigator<DashboardParamList>();

export function DashboardStackNavigator() {
  return (
    <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
      <DashboardStack.Screen name="Dashboard" component={DashboardScreen} />
      <DashboardStack.Screen
        options={{ presentation: 'modal' }}
        name="HelpLine"
        component={HelpLine}
      />
      <DashboardStack.Screen
        name="Notification"
        component={NotificationsListScreen}
      />
      <DashboardStack.Screen
        name="NotificationInfo"
        component={NotificationInfoScreen}
      />
    </DashboardStack.Navigator>
  );
}
