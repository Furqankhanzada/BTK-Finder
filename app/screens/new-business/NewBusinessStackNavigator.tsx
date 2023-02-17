import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { NewBusinessParamList } from '../../navigation/models/NewBusinessParamList';
import {
  LastRoutes,
  withAuthRedirection,
} from '../../navigation/hoc/withAuthRedirection';
import { NameScreen } from './name/NameScreen';

const NewBusinessStack = createStackNavigator<NewBusinessParamList>();

export default function NewBusinessStackNavigator() {
  return (
    <NewBusinessStack.Navigator screenOptions={{ headerShown: false }}>
      <NewBusinessStack.Screen
        name="Name"
        component={withAuthRedirection(NameScreen, {
          lastRoute: LastRoutes.NewBusinessStack,
        })}
      />
    </NewBusinessStack.Navigator>
  );
}
