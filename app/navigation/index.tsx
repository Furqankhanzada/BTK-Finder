import React, { MutableRefObject, useEffect, useRef } from 'react';
import { Platform, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDarkMode } from 'react-native-dynamic';
import { useTheme, BaseSetting } from '@config';
import SplashScreen from 'react-native-splash-screen';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

/* Modal Screen only affect iOS */
import Loading from '@screens/Loading';
import Filter from '@screens/Filter';
import ChooseItems from '@screens/ChooseItems';
import SearchHistory from '@screens/SearchHistory';
import SelectDarkOption from '@screens/SelectDarkOption';
import SelectFontOption from '@screens/SelectFontOption';

import { navigationRef, isReadyRef } from '../services/NavigationService';
import { trackScreenView } from '../userTracking';
import { setIsLogin } from '../actions/auth';
import { RootStackParamList } from './models/RootStackParamList';
import Main from './main';

const RootStack = createStackNavigator<RootStackParamList>();

export default function Navigator() {
  const dispatch = useDispatch();
  const storeLanguage = useSelector((state: any) => state.application.language);
  const { theme, colors } = useTheme();
  const isDarkMode = useDarkMode();
  const routeNameRef = useRef() as MutableRefObject<string>;

  const forFade = ({ current }: any) => ({
    cardStyle: {
      opacity: current.progress,
    },
  });

  useEffect(() => {
    i18n.use(initReactI18next).init({
      resources: BaseSetting.resourcesLanguage,
      lng: storeLanguage ?? BaseSetting.defaultLanguage,
      fallbackLng: BaseSetting.defaultLanguage,
    });
    if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.primary, true);
    }
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content', true);
    SplashScreen.hide();
  }, [colors.primary, isDarkMode, storeLanguage]);

  useEffect(() => {
    return () => {
      isReadyRef.current = false;
    };
  }, []);

  useEffect(() => {
    dispatch(setIsLogin());
  }, [dispatch]);

  const linking = {
    prefixes: ['explorebtk://', 'https://explorebtk.com'],
    config: {
      screens: {
        Main: {
          path: 'main',
          screens: {
            BusinessDetailTabNavigator: {
              path: 'businesses/:id',
              exact: true,
              screens: {
                ReviewStack: 'reviews',
                Products: 'products',
              },
            },
            MainBottomTabNavigator: {
              path: 'main_bottom',
              exact: true,
              screens: {
                Profile: {
                  path: 'profile',
                  exact: true,
                },
              },
            },
            ContactUs: {
              path: 'contact-us',
              exact: true,
            },
            AboutUs: {
              path: 'about-us',
              exact: true,
            },
          },
        },
      },
    },
  };

  return (
    <NavigationContainer
      theme={theme}
      ref={navigationRef}
      linking={linking}
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
        initialRouteName="Loading">
        <RootStack.Screen name="Loading" component={Loading} />
        <RootStack.Screen name="Main" component={Main} />
        <RootStack.Screen name="Filter" component={Filter} />
        <RootStack.Screen
          options={{ presentation: 'modal' }}
          name="ChooseItems"
          component={ChooseItems}
        />
        <RootStack.Screen name="SearchHistory" component={SearchHistory} />
        <RootStack.Screen
          name="SelectDarkOption"
          component={SelectDarkOption}
          options={{
            cardStyleInterpolator: forFade,
            cardStyle: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
          }}
        />
        <RootStack.Screen
          name="SelectFontOption"
          component={SelectFontOption}
          options={{
            cardStyleInterpolator: forFade,
            cardStyle: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
