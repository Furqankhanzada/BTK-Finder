import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { SettingsParamList } from 'navigation/models/SettingsParamList';

import Welcome from '@screens/auth/welcome';
import SignIn from '@screens/auth/signin';
import SignUp from '@screens/auth/signup';
import ProfileEdit from '@screens/profile/edit/ProfileEditScreen';
import ChangePassword from '@screens/ChangePassword';
import MyBusinessesScreen from '@screens/my-businesses/MyBusinessesScreen';
import ContactUs from '@screens/ContactUs';
import AboutUs from '@screens/AboutUs';
import Setting from '@screens/Setting';

const SettingsStack = createStackNavigator<SettingsParamList>();

export function SettingsStackNavigator() {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name="Welcome" component={Welcome} />
      <SettingsStack.Screen name="SignIn" component={SignIn} />
      <SettingsStack.Screen name="SignUp" component={SignUp} />
      <SettingsStack.Screen name="ProfileEdit" component={ProfileEdit} />

      <SettingsStack.Screen name="ChangePassword" component={ChangePassword} />
      <SettingsStack.Screen
        name="MyBusinesses"
        component={MyBusinessesScreen}
      />
      <SettingsStack.Screen name="ContactUs" component={ContactUs} />
      <SettingsStack.Screen name="AboutUs" component={AboutUs} />
      <SettingsStack.Screen name="Setting" component={Setting} />
    </SettingsStack.Navigator>
  );
}
