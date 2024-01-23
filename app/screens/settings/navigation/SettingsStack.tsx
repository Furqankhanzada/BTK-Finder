import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SettingsScreen from '@screens/settings/SettingsScreen';

import ProfileEditScreen from '@screens/settings/profile/edit/EditProfileScreen';
import SendNotificationScreen from '@screens/notifications/send/SendNotificationScreen';
import ContactUsScreen from '@screens/settings/contact-us/ContactUsScreen';
import AboutUsScreen from '@screens/settings/about-us/AboutUsScreen';
import AppearanceScreen from '@screens/settings/appearance/AppearanceScreen';

import { SettingsParamList } from '../../../navigation/models/SettingsParamList';
import MyBusinessStackNavigator from '../my-businesses/navigation/MyBusinessesStack';

import MyMemberships from '@screens/settings/my-memberships/MyMembershipsScreen';
import PaymentsDetails from '@screens/settings/my-memberships/components/PaymentsDetails';

const SettingsStack = createStackNavigator<SettingsParamList>();

export function SettingsStackNavigator() {
  return (
    <SettingsStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Settings">
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
      <SettingsStack.Screen name="EditProfile" component={ProfileEditScreen} />
      <SettingsStack.Screen name="MyMemberships" component={MyMemberships} />
      <SettingsStack.Screen name="ContactUs" component={ContactUsScreen} />
      <SettingsStack.Screen name="AboutUs" component={AboutUsScreen} />
      <SettingsStack.Screen name="Invoices" component={PaymentsDetails} />

      <SettingsStack.Screen
        name="MyBusinessesStack"
        component={MyBusinessStackNavigator}
      />
      <SettingsStack.Screen
        name="SendNotification"
        component={SendNotificationScreen}
      />
      <SettingsStack.Screen name="Appearance" component={AppearanceScreen} />
    </SettingsStack.Navigator>
  );
}
