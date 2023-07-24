import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import SplashScreen from 'react-native-splash-screen';

import { BaseColor, useFont, useTheme } from '@config';
import { Icon } from '@components';
import BusinessDetailNavigator from '@screens/businesses/BusinessDetailNavigator';

/* Bottom Screen */
import NewBusinessStackNavigator from '@screens/new-business/NewBusinessStackNavigator';
import FavouriteScreen from '@screens/favourite/FavouriteScreen';

/* Stack Screen */
import Category from '@screens/category/CategoryScreen';
import BusinessesScreen from '@screens/businesses/list/BusinessesScreen';
import { DashboardStackNavigator } from '@screens/dashboard/navigation/DashboardStack';
import { SettingsStackNavigator } from '@screens/settings/navigation/SettingsStack';
import { AuthStackNavigator } from '@screens/auth/navigation/AuthStack';
import useAuthStore, { AuthStoreStates } from '@screens/auth/store/Store';

import { MainStackParamList } from './models/MainStackParamList';
import { MainBottomTabParamList } from './models/MainBottomTabParamList';
import useAppStore from '../store/appStore';

const MainStack = createStackNavigator<MainStackParamList>();
const MainBottomTab = createBottomTabNavigator<MainBottomTabParamList>();

export default function Main() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <MainStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="MainBottomTabNavigator">
      <MainStack.Screen
        name="MainBottomTabNavigator"
        component={MainBottomTabNavigator}
      />
      <MainStack.Screen
        name="BusinessDetailTabNavigator"
        component={BusinessDetailNavigator}
      />
      <MainStack.Screen
        name="AuthStackNavigator"
        component={AuthStackNavigator}
      />
      <MainStack.Screen name="Category" component={Category} />
      <MainStack.Screen name="Businesses" component={BusinessesScreen} />
    </MainStack.Navigator>
  );
}

function MainBottomTabNavigator() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const font = useFont();
  const isLogin = useAuthStore((state: AuthStoreStates) => state.isLogin);
  const { fullscreen } = useAppStore();

  return (
    <MainBottomTab.Navigator
      initialRouteName="DashboardStack"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: BaseColor.grayColor,
        // style: { borderTopWidth: 1 },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: font,
        },
      }}>
      <MainBottomTab.Screen
        name="DashboardStack"
        component={DashboardStackNavigator}
        options={{
          title: t('home'),
          tabBarIcon: ({ color }) => {
            return <Icon color={color} name="home" size={20} solid />;
          },
          tabBarStyle: fullscreen ? { display: 'none' } : {},
        }}
      />
      <MainBottomTab.Screen
        name="Favourite"
        component={isLogin ? FavouriteScreen : AuthStackNavigator}
        options={{
          title: 'Favourite',
          tabBarIcon: ({ color }) => {
            return <Icon color={color} name="heart" size={20} solid />;
          },
        }}
      />
      <MainBottomTab.Screen
        name="NewBusiness"
        component={NewBusinessStackNavigator}
        options={{
          title: 'New Business',
          tabBarIcon: ({ color }) => {
            return <Icon color={color} name="building" size={20} solid />;
          },
        }}
      />
      <MainBottomTab.Screen
        name="SettingsStack"
        component={SettingsStackNavigator}
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => {
            return <Icon solid color={color} name="cogs" size={25} />;
          },
        }}
      />
    </MainBottomTab.Navigator>
  );
}
