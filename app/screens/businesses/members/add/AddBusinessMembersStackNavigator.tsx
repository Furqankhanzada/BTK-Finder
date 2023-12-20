import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AddMembersParamList } from 'navigation/models/AddMembersParamList';
import AddBusinessMember from './email/AddBusinessMember';

const NewMembersStack = createStackNavigator<AddMembersParamList>();

export default function NewMembersStackNavigator() {
  return (
    <NewMembersStack.Navigator screenOptions={{ headerShown: false }}>
      <NewMembersStack.Screen name="Email" component={AddBusinessMember} />
    </NewMembersStack.Navigator>
  );
}
