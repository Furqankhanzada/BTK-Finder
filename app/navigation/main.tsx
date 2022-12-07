import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { BaseColor, useFont, useTheme } from '@config';
import { Icon } from '@components';
import BusinessDetailNavigator from '@screens/businesses/BusinessDetailNavigator';

import { setEditBusiness } from '../actions/business';
import { LastRoutes, withAuthRedirection } from './hoc/withAuthRedirection';

/* Bottom Screen */
import Notification from '@screens/Notification';
// import Business from '@screens/AddBusiness';
import FavouriteScreen from '@screens/favourite/FavouriteScreen';
import Messenger from '@screens/Messenger';
import { NewBusinessStackNavigator } from '@screens/new-business/navigation/NewBusinessStack';

/* Stack Screen */
import ThemeSetting from '@screens/ThemeSetting';
import Category from '@screens/category/CategoryScreen';
import VerifyCode from '@screens/VerifyCode';
import Messages from '@screens/Messages';
import Walkthrough from '@screens/Walkthrough';
import ResetPassword from '@screens/ResetPassword';
import ChangeLanguage from '@screens/ChangeLanguage';
// import Address from '@screens/AddBusiness/address';
// import Hours from '@screens/AddBusiness/hours';
// import PriceRange from '@screens/AddBusiness/priceRange';
// import FinalReview from '@screens/AddBusiness/review';
// import Gallery from '@screens/AddBusiness/gallery';
import { DashboardStackNavigator } from '@screens/dashboard/navigation/DashboardStack';
import BusinessesScreen from '@screens/businesses/list/BusinessesScreen';

import { MainStackParamList } from './models/MainStackParamList';
import { MainBottomTabParamList } from './models/MainBottomTabParamList';
import useAddBusinessStore from '@screens/new-business/store/Store';
import { SettingsStackNavigator } from '@screens/settings/navigation/SettingsStack';

const MainStack = createStackNavigator<MainStackParamList>();
const MainBottomTab = createBottomTabNavigator<MainBottomTabParamList>();

export default function Main() {
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
      <MainStack.Screen name="Category" component={Category} />
      <MainStack.Screen name="Businesses" component={BusinessesScreen} />
      <MainStack.Screen name="Walkthrough" component={Walkthrough} />
      <MainStack.Screen name="Messenger" component={Messenger} />
      <MainStack.Screen name="Messages" component={Messages} />
      <MainStack.Screen name="Notification" component={Notification} />
      <MainStack.Screen name="ResetPassword" component={ResetPassword} />
      <MainStack.Screen name="ChangeLanguage" component={ChangeLanguage} />
      {/*<MainStack.Screen name="Business" component={Business} />*/}
      {/* <MainStack.Screen name="Address" component={Address} /> */}
      {/* <MainStack.Screen name="Hours" component={Hours} /> */}
      {/* <MainStack.Screen name="PriceRange" component={PriceRange} /> */}
      {/* <MainStack.Screen name="FinalReview" component={FinalReview} /> */}
      {/* <MainStack.Screen name="Gallery" component={Gallery} /> */}
      <MainStack.Screen name="VerifyCode" component={VerifyCode} />
    </MainStack.Navigator>
  );
}

function MainBottomTabNavigator() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const font = useFont();

  const setIsEditBusiness = useAddBusinessStore(
    (state: any) => state.setIsEditBusiness,
  );

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
        name="NewBusinessStack"
        // component={withAuthRedirection(NewBusinessStackNavigator, {
        //   lastRoute: LastRoutes.NewBusinessStack,
        // })}
        component={NewBusinessStackNavigator}
        options={{
          title: 'New Business',
          tabBarIcon: ({ color }) => {
            return <Icon color={color} name="business-time" size={20} solid />;
          },
        }}
        listeners={() => ({
          tabPress: () => {
            setIsEditBusiness(false);
          },
        })}
      />

      {/* <BottomTab.Screen
        name="Notification"
        component={Notification}
        options={{
          title: t('notification'),
          tabBarIcon: ({ color }) => {
            return <Icon color={color} name="bell" size={20} solid />;
          },
        }}
      /> */}
      <MainBottomTab.Screen
        name="SettingsStack"
        component={SettingsStackNavigator}
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => {
            return <Icon solid color={color} name="user-alt" size={20} />;
          },
        }}
      />
    </MainBottomTab.Navigator>
  );
}
