import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { DashboardParamList } from '../../../navigation/models/DashboardParamList';
import HelpLine from '@screens/dashboard/helpline/HelplineScreen';
import DashboardScreen from '@screens/dashboard/DashboardScreen';
import { NotificationStackNavigator } from './NotificationStack';

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
        name="NotificationStack"
        component={NotificationStackNavigator}
      />
    </DashboardStack.Navigator>
  );
}
