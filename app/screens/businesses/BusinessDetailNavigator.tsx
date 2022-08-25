import React from 'react';
import {
  BottomTabScreenProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { BaseColor, useTheme, useFont } from '@config';
import { Icon } from '@components';

import Review from './reviews/BusinessReviewsScreen';
import BusinessOverviewScreen from './info/BusinessOverviewScreen';
import BusinessProductsScreen from './products/BusinessProductsScreen';
import { useBusiness } from '@screens/businesses/queries/queries';
import {
  BusinessType,
  ShopStatus,
} from '@screens/businesses/models/BusinessPresentable';

import { BusinessDetailBottomTabParamList } from '../../navigation/models/BusinessDetailBottomTabParamList';
import { MainStackParamList } from '../../navigation/models/MainStackParamList';

const BusinessDetailBottomTab =
  createBottomTabNavigator<BusinessDetailBottomTabParamList>();

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
        name="Reviews"
        initialParams={{ id: businessId }}
        options={{
          title: 'Reviews',
          tabBarIcon: ({ color }) => {
            return <Icon solid color={color} name="star" size={25} />;
          },
        }}
        component={Review}
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
