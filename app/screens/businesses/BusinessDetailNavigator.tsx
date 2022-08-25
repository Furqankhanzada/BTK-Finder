import React from 'react';
import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  createStackNavigator,
  StackScreenProps,
} from '@react-navigation/stack';

import { BaseColor, useTheme, useFont } from '@config';
import { Icon } from '@components';
import { useBusiness } from '@screens/businesses/queries/queries';
import {
  BusinessType,
  ShopStatus,
} from '@screens/businesses/models/BusinessPresentable';

import BusinessReviewsScreen from './reviews/BusinessReviewsScreen';
import BusinessOverviewScreen from './info/BusinessOverviewScreen';
import BusinessProductsScreen from './products/BusinessProductsScreen';
import AddReviewScreen from './add-review/AddReviewScreen';

import {
  BusinessDetailBottomTabParamList,
  ReviewStackParamList,
} from '../../navigation/models/BusinessDetailBottomTabParamList';
import { MainStackParamList } from '../../navigation/models/MainStackParamList';

const BusinessDetailBottomTab =
  createBottomTabNavigator<BusinessDetailBottomTabParamList>();

const ReviewStack = createStackNavigator<ReviewStackParamList>();

function ReviewStackNavigator({
  route,
}: StackScreenProps<BusinessDetailBottomTabParamList, 'ReviewStack'>) {
  const businessId = route.params.id;

  return (
    <ReviewStack.Navigator screenOptions={{ headerShown: false }}>
      <ReviewStack.Screen
        initialParams={{ id: businessId }}
        name="Reviews"
        component={BusinessReviewsScreen}
      />
      <ReviewStack.Screen
        initialParams={{ id: businessId }}
        name="AddReview"
        component={AddReviewScreen}
      />
    </ReviewStack.Navigator>
  );
}

export default function BusinessDetailNavigator({
  route,
}: BottomTabScreenProps<MainStackParamList, 'BusinessDetailTabNavigator'>) {
  const businessId = route.params.id;
  const { colors } = useTheme();
  const font = useFont();
  const { isLoading, data } = useBusiness(route.params.id);

  return (
    <BusinessDetailBottomTab.Navigator
      initialRouteName="Overview"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: BaseColor.grayColor,
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: font,
        },
      }}>
      <BusinessDetailBottomTab.Screen
        name="Overview"
        initialParams={{ id: businessId }}
        options={{
          title: 'Overview',
          tabBarIcon: ({ color }) => {
            return <Icon color={color} name="info-circle" size={25} solid />;
          },
        }}
        component={BusinessOverviewScreen}
      />
      <BusinessDetailBottomTab.Screen
        name="ReviewStack"
        initialParams={{ id: businessId }}
        options={{
          title: 'Reviews',
          tabBarIcon: ({ color }) => {
            return <Icon solid color={color} name="star" size={25} />;
          },
        }}
        component={ReviewStackNavigator}
      />
      {!isLoading && data?.shop && data.shop.status === ShopStatus.enabled ? (
        <BusinessDetailBottomTab.Screen
          initialParams={{ id: businessId }}
          name="Products"
          component={BusinessProductsScreen}
          options={{
            title: data.type === BusinessType.restaurant ? 'Menu' : 'Products',
            tabBarIcon: ({ color }) => {
              return <Icon solid color={color} name="elementor" size={25} />;
            },
          }}
        />
      ) : null}
    </BusinessDetailBottomTab.Navigator>
  );
}
