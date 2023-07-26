import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SignInScreen from '@screens/auth/login/SignInScreen';
import SignUpScreen from '@screens/auth/register/SignUpScreen';
import WelcomeAuthScreen from '@screens/auth/welcome-auth/WelcomeAuthScreen';
import ResetPasswordScreen from '@screens/auth/reset-password/ResetPasswordScreen';
import VerifyCodeScreen from '@screens/auth/verify-code/VerifyCodeScreen';
import ChangePasswordScreen from '@screens/auth/change-password/ChangePasswordScreen';

import { AuthParamList } from '../../../navigation/models/AuthParamList';

const AuthStack = createStackNavigator<AuthParamList>();

export function AuthStackNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen
        name="WelcomeAuth"
        component={WelcomeAuthScreen}
        initialParams={{ shouldGoBack: false }}
      />
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <AuthStack.Screen name="VerifyCode" component={VerifyCodeScreen} />
      <AuthStack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
      />
    </AuthStack.Navigator>
  );
}
