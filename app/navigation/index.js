import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDarkMode, ColorSchemeProvider } from 'react-native-dynamic';
import { useTheme, BaseSetting } from '@config';
import SplashScreen from 'react-native-splash-screen';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { navigationRef, isReadyRef } from '../services/NavigationService';

/* Main Stack Navigator */
import Main from 'app/navigation/main';
/* Modal Screen only affect iOS */
import Loading from '@screens/Loading';
import Filter from '@screens/Filter';
import ChooseItems from '@screens/ChooseItems';
import SearchHistory from '@screens/SearchHistory';
import PreviewImage from '@screens/PreviewImage';
import SelectDarkOption from '@screens/SelectDarkOption';
import SelectFontOption from '@screens/SelectFontOption';
import HelpLine from '@screens/HelpLine';
import Category from '@screens/Category';
import Toast from 'react-native-toast-message';
import { setIsLogin } from '../actions/auth';
import { trackScreenView } from '../userTracking';

const RootStack = createStackNavigator();

export default function Navigator() {
  const dispatch = useDispatch();
  const storeLanguage = useSelector((state) => state.application.language);
  const { theme, colors } = useTheme();
  const isDarkMode = useDarkMode();
  const routeNameRef = useRef();

  const forFade = ({ current, closing }) => ({
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
    SplashScreen.hide();
    StatusBar.setBackgroundColor(colors.primary, true);
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content', true);
  }, [colors.primary, isDarkMode, storeLanguage]);

  useEffect(() => {
    return () => {
      isReadyRef.current = false;
    };
  }, []);

  useEffect(() => {
    dispatch(setIsLogin());
  }, [dispatch]);

  return (
    <ColorSchemeProvider>
      <NavigationContainer
        theme={theme}
        ref={navigationRef}
        onReady={() => {
          isReadyRef.current = true;
        }}
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current.getCurrentRoute().name;

          if (previousRouteName !== currentRouteName) {
            if (previousRouteName !== currentRouteName) {
              trackScreenView(currentRouteName);
            }
          }
          routeNameRef.current = currentRouteName;
        }}>
        <RootStack.Navigator
          mode="modal"
          headerMode="none"
          initialRouteName="Loading">
          <RootStack.Screen
            name="Loading"
            component={Loading}
            options={{ gestureEnabled: false }}
          />
          <RootStack.Screen name="Main" component={Main} />
          <RootStack.Screen name="HelpLine" component={HelpLine} />
          <RootStack.Screen name="Category" component={Category} />
          <RootStack.Screen name="Filter" component={Filter} />
          <RootStack.Screen name="ChooseItems" component={ChooseItems} />
          <RootStack.Screen name="SearchHistory" component={SearchHistory} />
          <RootStack.Screen name="PreviewImage" component={PreviewImage} />
          <RootStack.Screen
            name="SelectDarkOption"
            component={SelectDarkOption}
            gestureEnabled={false}
            options={{
              cardStyleInterpolator: forFade,
              cardStyle: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
            }}
          />
          <RootStack.Screen
            name="SelectFontOption"
            component={SelectFontOption}
            gestureEnabled={false}
            options={{
              cardStyleInterpolator: forFade,
              cardStyle: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
            }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </ColorSchemeProvider>
  );
}
