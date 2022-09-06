import { createStackNavigator } from '@react-navigation/stack';

import React from 'react';
import { NewBusinessParamList } from '../../../navigation/models/NewBusinessParamList';
import { NameScreen } from '../NameScreen';
import { DiscriptionScreen } from '../DiscriptionScreen';

const NewBusinessStack = createStackNavigator<NewBusinessParamList>();

export function NewBusinessNavigator() {
  return (
    <NewBusinessStack.Navigator screenOptions={{ headerShown: false }}>
      <NewBusinessStack.Screen name="Name" component={NameScreen} />
      <NewBusinessStack.Screen name="Discription" component={DiscriptionScreen}
      />
    </NewBusinessStack.Navigator>
  );
}
