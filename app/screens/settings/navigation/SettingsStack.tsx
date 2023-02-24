import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SettingsScreen from '@screens/settings/SettingsScreen';

import ProfileEditScreen from '@screens/settings/profile/edit/EditProfileScreen';
import ChangePasswordScreen from '@screens/settings/change-password/ChangePasswordScreen';
import SendNotificationScreen from '@screens/notifications/send/SendNotificationScreen';
import ContactUsScreen from '@screens/settings/contact-us/ContactUsScreen';
import AboutUsScreen from '@screens/settings/about-us/AboutUsScreen';
import AppearanceScreen from '@screens/settings/appearance/AppearanceScreen';
import MyBusinessesScreen from '@screens/settings/my-businesses/MyBusinessesScreen';

import { SettingsParamList } from '../../../navigation/models/SettingsParamList';
import SignInScreen from '@screens/settings/signin/SignInScreen';

const SettingsStack = createStackNavigator<SettingsParamList>();

export function SettingsStackNavigator() {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
      <SettingsStack.Screen name="EditProfile" component={ProfileEditScreen} />
      <SettingsStack.Screen name="ContactUs" component={ContactUsScreen} />
      <SettingsStack.Screen name="AboutUs" component={AboutUsScreen} />
      <SettingsStack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
      />
      <SettingsStack.Screen
        name="MyBusinesses"
        component={MyBusinessesScreen}
      />
      <SettingsStack.Screen
        name="SendNotification"
        component={SendNotificationScreen}
      />
      <SettingsStack.Screen name="Appearance" component={AppearanceScreen} />
      <SettingsStack.Screen name="SignIn" component={SignInScreen} />
    </SettingsStack.Navigator>
  );
}
