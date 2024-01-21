import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AddMembersParamList } from 'navigation/models/AddMembersParamList';
import EmailScreen from './email/EmailScreen';
import PackagesScreen from './packages/PackagesScreen';
import DurationScreen from './duration/DurationScreen';
import BillingScreen from './BillingDate/BillingScreen';

const NewMembersStack = createStackNavigator<AddMembersParamList>();

export default function NewMembersStackNavigator() {
  const businessId = '6401d1445d381e3bcd4b47e7';
  console.log(businessId);

  return (
    <NewMembersStack.Navigator screenOptions={{ headerShown: false }}>
      <NewMembersStack.Screen name="Email" component={EmailScreen} />
      <NewMembersStack.Screen name="Packages" component={PackagesScreen} />
      <NewMembersStack.Screen name="Duration" component={DurationScreen} />
      <NewMembersStack.Screen name="Billing" component={BillingScreen} />
    </NewMembersStack.Navigator>
  );
}
