import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MyMemberships from '../MyMembershipsScreen';
import { MyMembershipsStackParamList } from 'navigation/models/MyMembershipsStackParamList';
import InvoicesScreen from '../invoices/InvoicesScreen';

const MyMembershipsStack = createStackNavigator<MyMembershipsStackParamList>();

const MyMembershipsStackNavigator = () => {
  return (
    <MyMembershipsStack.Navigator screenOptions={{ headerShown: false }}>
      <MyMembershipsStack.Screen
        name="MyMemberships"
        component={MyMemberships}
      />
      <MyMembershipsStack.Screen name="Invoices" component={InvoicesScreen} />
    </MyMembershipsStack.Navigator>
  );
};

export default MyMembershipsStackNavigator;
