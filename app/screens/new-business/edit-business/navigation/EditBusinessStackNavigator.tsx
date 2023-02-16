import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { EditBusinessStackParamList } from 'navigation/models/EditBusinessStackParamList';
import EditBusinessScreen from '../EditBusinessScreen';
import NewBusinessStackNavigator from '../../NewBusinessStackNavigator';

const EditBusinessStack = createStackNavigator<EditBusinessStackParamList>();

export default function EditBusinessStackNavigator() {
  return (
    <EditBusinessStack.Navigator screenOptions={{ headerShown: false }}>
      <EditBusinessStack.Screen
        name="EditBusiness"
        component={EditBusinessScreen}
      />
      <EditBusinessStack.Screen
        name="Edit"
        component={NewBusinessStackNavigator}
      />
    </EditBusinessStack.Navigator>
  );
}
