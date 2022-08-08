import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BaseColor, useTheme, useFont } from '@config';
import { Icon } from '@components';

/* Bottom Screen */
import Review from '@screens/Review';
import PlaceDetail from '@screens/PlaceDetail';
import Products from '@screens/Products';

const BusinessDetailStack = createStackNavigator();
const BusinessDetailBottomTab = createBottomTabNavigator();

export default function BusinessDetailNavigator() {
  return (
    <BusinessDetailStack.Navigator
      headerMode="none"
      initialRouteName="BottomTabNavigator">
      <BusinessDetailStack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
      />
    </BusinessDetailStack.Navigator>
  );
}

function BottomTabNavigator() {
  const { colors } = useTheme();
  const font = useFont();
  return (
    <BusinessDetailBottomTab.Navigator
      initialRouteName="PlaceDetail"
      headerMode="none"
      tabBarOptions={{
        showIcon: true,
        showLabel: true,
        activeTintColor: colors.primary,
        inactiveTintColor: BaseColor.grayColor,
        style: { borderTopWidth: 1 },
        labelStyle: {
          fontSize: 12,
          fontFamily: font,
        },
      }}>
      <BusinessDetailBottomTab.Screen
        name="Overview"
        component={PlaceDetail}
        options={{
          title: 'Overview',
          tabBarIcon: ({ color }) => {
            return <Icon color={color} name="info-circle" size={25} solid />;
          },
        }}
      />
      <BusinessDetailBottomTab.Screen
        name="Reviews"
        component={Review}
        options={{
          title: 'Reviews',
          tabBarIcon: ({ color }) => {
            return <Icon solid color={color} name="star" size={25} />;
          },
        }}
      />
      <BusinessDetailBottomTab.Screen
        name="Menu"
        component={Products}
        options={{
          title: 'Menu',
          tabBarIcon: ({ color }) => {
            return <Icon solid color={color} name="elementor" size={25} />;
          },
        }}
      />
    </BusinessDetailBottomTab.Navigator>
  );
}
