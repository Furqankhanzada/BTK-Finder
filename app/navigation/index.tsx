import React, { MutableRefObject, useEffect, useRef } from 'react';
import { Platform, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDarkMode } from 'react-native-dynamic';
import { useTheme, BaseSetting } from '@config';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  usePushNotifications,
  useDynamicLinks,
  useNativeUpdate,
  useRemoteConfig,
  useAuth,
} from '@hooks';

/* Modal Screen only affect iOS */
import Filter from '@screens/Filter';
import ChooseItems from '@screens/ChooseItems';
import SearchHistory from '@screens/SearchHistory';

import { navigationRef, isReadyRef } from '../services/NavigationService';
import { trackScreenView } from '../userTracking';
import { RootStackParamList } from './models/RootStackParamList';
import Main from './main';
import { linkingConfig } from './deep-linking/LinkingConfig';
import useAppStore from '../store/appStore';
import { Font, ThemeMode } from 'store/models/appStore';

const RootStack = createStackNavigator<RootStackParamList>();

export default function Navigator() {
  // Firebase Dynamic links handling
  useDynamicLinks();
  // Firebase push notification and cloud messaging
  usePushNotifications();
  // in-app update hook
  useNativeUpdate();
  // Firebase remote config
  useRemoteConfig();
  // Check token and set login
  useAuth();

  const { setThemeMode, setFont } = useAppStore();
  const { theme, colors } = useTheme();
  const isDarkMode = useDarkMode();
  const routeNameRef = useRef() as MutableRefObject<string>;

  useEffect(() => {
    i18n.use(initReactI18next).init({
      resources: BaseSetting.resourcesLanguage,
      lng: BaseSetting.defaultLanguage,
      fallbackLng: BaseSetting.defaultLanguage,
    });
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.primary, true);
    }
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content', true);
  }, [colors.primary, isDarkMode]);

  useEffect(() => {
    return () => {
      isReadyRef.current = false;
    };
  }, []);

  useEffect(() => {
    const getDarkTheme = async () => {
      const themeMode = (await AsyncStorage.getItem('themeMode')) as ThemeMode;
      if (themeMode) {
        setThemeMode(themeMode);
      }
    };
    getDarkTheme();
  }, [setThemeMode]);

  useEffect(() => {
    const getFont = async () => {
      const font = (await AsyncStorage.getItem('font')) as Font;
      if (font) {
        setFont(font);
      }
    };
    getFont();
  }, [setFont]);

  return (
    <NavigationContainer
      theme={theme}
      ref={navigationRef}
      linking={linkingConfig}
      onReady={() => {
        isReadyRef.current = true;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;
        if (currentRouteName) {
          if (previousRouteName !== currentRouteName) {
            trackScreenView(currentRouteName);
          }
          routeNameRef.current = currentRouteName;
        }
      }}>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Main">
        <RootStack.Screen name="Main" component={Main} />
        <RootStack.Screen name="Filter" component={Filter} />
        <RootStack.Screen
          options={{ presentation: 'modal' }}
          name="ChooseItems"
          component={ChooseItems}
        />
        <RootStack.Screen name="SearchHistory" component={SearchHistory} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
