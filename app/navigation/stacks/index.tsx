import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SettingsStackParamList } from './types';

import ThemeView from '@screens/ThemeView';
import SettingsView from '@screens/SettingsView';

const SettingsStack = createStackNavigator<SettingsStackParamList>();
const SettingsStackNavigator = () => {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <SettingsStack.Screen name="SettingsView" component={SettingsView} />
      <SettingsStack.Screen name="ThemeView" component={ThemeView} />
    </SettingsStack.Navigator>
  );
};

export { SettingsStackNavigator };
