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
import Home from '@screens/Home';
// import Notification from '@screens/Notification';
import Business from '@screens/AddBusiness';
import FavouriteScreen from '@screens/favourite/FavouriteScreen';
import Messenger from '@screens/Messenger';
import Profile from '@screens/Profile';

/* Stack Screen */
import ThemeSetting from '@screens/ThemeSetting';
import Setting from '@screens/Setting';
import Category from '@screens/Category';
import Place from '@screens/Place';
import SignUp from '@screens/SignUp';
import SignIn from '@screens/SignIn';
import VerifyCode from '@screens/VerifyCode';
import Review from '@screens/businesses/reviews/BusinessReviewsScreen';
import Feedback from '@screens/Feedback';
import Messages from '@screens/Messages';
import Walkthrough from '@screens/Walkthrough';
import ResetPassword from '@screens/ResetPassword';
import ChangePassword from '@screens/ChangePassword';
import ProfileEdit from '@screens/ProfileEdit';
import ChangeLanguage from '@screens/ChangeLanguage';
import ContactUs from '@screens/ContactUs';
import AboutUs from '@screens/AboutUs';
import Address from '@screens/AddBusiness/address';
import Hours from '@screens/AddBusiness/hours';
import PriceRange from '@screens/AddBusiness/priceRange';
import FinalReview from '@screens/AddBusiness/review';
import Gallery from '@screens/AddBusiness/gallery';
import MyBusinesses from '@screens/MyBusinesses';

const MainStack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

export default function Main() {
  return (
    <MainStack.Navigator
      headerMode="none"
      initialRouteName="BottomTabNavigator">
      <MainStack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
      />
      <MainStack.Screen
        name="BusinessDetailTabNavigator"
        component={BusinessDetailNavigator}
      />
      <MainStack.Screen name="ThemeSetting" component={ThemeSetting} />
      <MainStack.Screen name="Setting" component={Setting} />
      <MainStack.Screen name="Category" component={Category} />
      <MainStack.Screen name="Place" component={Place} />
      <MainStack.Screen name="Walkthrough" component={Walkthrough} />
      <MainStack.Screen name="SignUp" component={SignUp} />
      <MainStack.Screen name="SignIn" component={SignIn} />
      <MainStack.Screen name="Messenger" component={Messenger} />
      <MainStack.Screen name="Review" component={Review} />
      <MainStack.Screen name="Feedback" component={Feedback} />
      <MainStack.Screen name="Messages" component={Messages} />
      {/* <MainStack.Screen name="Notification" component={Notification} /> */}
      <MainStack.Screen name="ResetPassword" component={ResetPassword} />
      <MainStack.Screen name="ChangePassword" component={ChangePassword} />
      <MainStack.Screen name="ProfileEdit" component={ProfileEdit} />
      <MainStack.Screen name="ChangeLanguage" component={ChangeLanguage} />
      <MainStack.Screen name="ContactUs" component={ContactUs} />
      <MainStack.Screen name="AboutUs" component={AboutUs} />
      {/*<MainStack.Screen name="Business" component={Business} />*/}
      <MainStack.Screen name="Address" component={Address} />
      <MainStack.Screen name="Hours" component={Hours} />
      <MainStack.Screen name="PriceRange" component={PriceRange} />
      <MainStack.Screen name="FinalReview" component={FinalReview} />
      <MainStack.Screen name="Gallery" component={Gallery} />
      <MainStack.Screen name="MyBusinesses" component={MyBusinesses} />
      <MainStack.Screen name="EditBusiness" component={Business} />
      <MainStack.Screen name="VerifyCode" component={VerifyCode} />
    </MainStack.Navigator>
  );
}

function BottomTabNavigator() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const font = useFont();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        showLabel: true,
        activeTintColor: colors.primary,
        inactiveTintColor: BaseColor.grayColor,
        style: { borderTopWidth: 1 },
        labelStyle: {
          fontSize: 12,
          fontFamily: font,
        },
      }}>
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{
          title: t('home'),
          tabBarIcon: ({ color }) => {
            return <Icon color={color} name="home" size={20} solid />;
          },
        }}
      />

      <BottomTab.Screen
        name="FavouriteScreen"
        component={withAuthRedirection(FavouriteScreen, {
          lastRoute: LastRoutes.FavouriteScreen,
        })}
        options={{
          title: 'Favorite',
          tabBarIcon: ({ color }) => {
            return <Icon color={color} name="heart" size={20} solid />;
          },
        }}
      />
      <BottomTab.Screen
        name="Business"
        component={withAuthRedirection(Business, {
          lastRoute: LastRoutes.Business,
        })}
        options={{
          title: 'Add Business',
          tabBarIcon: ({ color }) => {
            return <Icon color={color} name="business-time" size={20} solid />;
          },
        }}
        listeners={() => ({
          tabPress: () => {
            dispatch(setEditBusiness(false));
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
      <BottomTab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'More',
          tabBarIcon: ({ color }) => {
            return <Icon solid color={color} name="ellipsis-h" size={25} />;
          },
        }}
      />
    </BottomTab.Navigator>
  );
}