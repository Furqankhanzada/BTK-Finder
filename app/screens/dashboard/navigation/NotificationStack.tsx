import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { NotificationParamList } from '../../../navigation/models/NotificationParamList';
import NotificationsListScreen from '@screens/notifications/list/NotificationsListScreen';
import NotificationDetailScreen from '@screens/notifications/detail/NotificationDetailScreen';

const NotificationStack = createStackNavigator<NotificationParamList>();

export function NotificationStackNavigator() {
  return (
    <NotificationStack.Navigator screenOptions={{ headerShown: false }}>
      <NotificationStack.Screen
        name="Notification"
        component={NotificationsListScreen}
      />
      <NotificationStack.Screen
        name="NotificationDetail"
        component={NotificationDetailScreen}
      />
    </NotificationStack.Navigator>
  );
}
