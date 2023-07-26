import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { MyBusinessesStackParamList } from 'navigation/models/MyBusinessesParamList';
import MyBusinessesScreen from '../MyBusinessesScreen';
import EditBusinessScreen from '../edit-business/EditBusinessScreen';
import NewBusinessStackNavigator from '@screens/new-business/NewBusinessStackNavigator';

const MyBusinessStack = createStackNavigator<MyBusinessesStackParamList>();

export default function MyBusinessStackNavigator() {
  return (
    <MyBusinessStack.Navigator screenOptions={{ headerShown: false }}>
      <MyBusinessStack.Screen
        name="MyBusinesses"
        component={MyBusinessesScreen}
      />
      <MyBusinessStack.Screen
        name="MyBusiness"
        component={EditBusinessScreen}
      />
      <MyBusinessStack.Screen
        name="Edit"
        component={NewBusinessStackNavigator}
      />
    </MyBusinessStack.Navigator>
  );
}
