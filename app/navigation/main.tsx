import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import SplashScreen from 'react-native-splash-screen';

import { BaseColor, useFont, useTheme } from '@config';
import { Icon } from '@components';
import BusinessDetailNavigator from '@screens/businesses/BusinessDetailNavigator';

import { LastRoutes, withAuthRedirection } from './hoc/withAuthRedirection';

/* Bottom Screen */
import NewBusinessStackNavigator from '@screens/new-business/NewBusinessStackNavigator';
import FavouriteScreen from '@screens/favourite/FavouriteScreen';
import Messenger from '@screens/Messenger';
import Welcome from '@screens/auth/welcome';

/* Stack Screen */
import ThemeSetting from '@screens/ThemeSetting';
import Setting from '@screens/Setting';
import Category from '@screens/category/CategoryScreen';
import SignUp from '@screens/auth/signup';
import SignIn from '@screens/auth/signin';
import VerifyCode from '@screens/VerifyCode';
import Messages from '@screens/Messages';
import Walkthrough from '@screens/Walkthrough';
import ResetPassword from '@screens/ResetPassword';
import ChangePassword from '@screens/ChangePassword';
import ProfileEdit from '@screens/profile/edit/ProfileEditScreen';
import ChangeLanguage from '@screens/ChangeLanguage';
import ContactUs from '@screens/ContactUs';
import AboutUs from '@screens/AboutUs';
import MyBusinessesScreen from '@screens/my-businesses/MyBusinessesScreen';
import { DashboardStackNavigator } from '@screens/dashboard/navigation/DashboardStack';
import BusinessesScreen from '@screens/businesses/list/BusinessesScreen';
import SendNotificationScreen from '@screens/notifications/send/SendNotificationScreen';

import { MainStackParamList } from './models/MainStackParamList';
import { MainBottomTabParamList } from './models/MainBottomTabParamList';
import EditBusinessStackNavigator from '@screens/new-business/edit-business/navigation/EditBusinessStackNavigator';

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
      <MainStack.Screen name="ThemeSetting" component={ThemeSetting} />
      <MainStack.Screen name="Setting" component={Setting} />
      <MainStack.Screen name="Category" component={Category} />
      <MainStack.Screen name="Businesses" component={BusinessesScreen} />
      <MainStack.Screen name="Walkthrough" component={Walkthrough} />
      <MainStack.Screen name="SignUp" component={SignUp} />
      <MainStack.Screen name="SignIn" component={SignIn} />
      <MainStack.Screen name="Messenger" component={Messenger} />
      <MainStack.Screen name="Messages" component={Messages} />
      <MainStack.Screen name="ResetPassword" component={ResetPassword} />
      <MainStack.Screen name="ChangePassword" component={ChangePassword} />
      <MainStack.Screen name="ProfileEdit" component={ProfileEdit} />
      <MainStack.Screen name="ChangeLanguage" component={ChangeLanguage} />
      <MainStack.Screen name="ContactUs" component={ContactUs} />
      <MainStack.Screen name="AboutUs" component={AboutUs} />
      <MainStack.Screen name="MyBusinesses" component={MyBusinessesScreen} />
      <MainStack.Screen
        name="EditBusinessStack"
        component={EditBusinessStackNavigator}
      />
      <MainStack.Screen name="VerifyCode" component={VerifyCode} />
      <MainStack.Screen
        name="SendNotification"
        component={SendNotificationScreen}
      />
    </MainStack.Navigator>
  );
}

function MainBottomTabNavigator() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const font = useFont();

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
        }}
      />
      <MainBottomTab.Screen
        name="Favourite"
        component={withAuthRedirection(FavouriteScreen, {
          lastRoute: LastRoutes.Favourite,
        })}
        options={{
          title: 'Favourite',
          tabBarIcon: ({ color }) => {
            return <Icon color={color} name="heart" size={20} solid />;
          },
        }}
      />
      <MainBottomTab.Screen
        name="Business"
        component={NewBusinessStackNavigator}
        options={{
          title: 'New Business',
          tabBarIcon: ({ color }) => {
            return <Icon color={color} name="building" size={20} solid />;
          },
        }}
      />
      <MainBottomTab.Screen
        name="Welcome"
        component={Welcome}
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => {
            return <Icon solid color={color} name="ellipsis-h" size={25} />;
          },
        }}
      />
    </MainBottomTab.Navigator>
  );
}
