import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AddMembersParamList } from 'navigation/models/AddMembersParamList';
import AddBusinessMember from './email/AddBusinessMember';
import PackagesScreen from './packages/PackagesScreen';
import DurationScreen from './durations/DurationScreen';

const NewMembersStack = createStackNavigator<AddMembersParamList>();

export default function NewMembersStackNavigator() {
  const businessId = '6401d1445d381e3bcd4b47e7';
  console.log(businessId);

  return (
    <NewMembersStack.Navigator screenOptions={{ headerShown: false }}>
      <NewMembersStack.Screen name="Email" component={AddBusinessMember} />
      <NewMembersStack.Screen name="Pakages" component={PackagesScreen} />
      <NewMembersStack.Screen name="duration" component={DurationScreen} />
    </NewMembersStack.Navigator>
  );
}
