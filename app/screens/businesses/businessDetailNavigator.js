import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BaseColor, useTheme, useFont } from '@config';
import { Icon } from '@components';

/* Bottom Screen */
import Review from './reviews/BusinessReviewsScreen';
import BusinessInfoScreen from './info/BusinessInfoScreen';
import BusinessProductsScreen from './products/BusinessProductsScreen';
import { useBusiness } from '@screens/businesses/apis/queries';

const BusinessDetailBottomTab = createBottomTabNavigator();

export default function BusinessDetailNavigator({ navigation, route }) {
  const { colors } = useTheme();
  const font = useFont();
  const { isLoading, data } = useBusiness(route?.params?.id);

  const navigateTo = (name) => {
    navigation.navigate(name);
  };

  return (
    <BusinessDetailBottomTab.Navigator
      initialRouteName="Overview"
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
        options={{
          title: 'Overview',
          tabBarIcon: ({ color }) => {
            return <Icon color={color} name="info-circle" size={25} solid />;
          },
        }}>
        {(props) => (
          <BusinessInfoScreen
            {...props}
            business={data}
            isLoading={isLoading}
            navigateTo={navigateTo}
          />
        )}
      </BusinessDetailBottomTab.Screen>
      <BusinessDetailBottomTab.Screen
        name="Reviews"
        options={{
          title: 'Reviews',
          tabBarIcon: ({ color }) => {
            return <Icon solid color={color} name="star" size={25} />;
          },
        }}>
        {(props) => (
          <Review
            {...props}
            businessId={data._id}
            reviews={data.reviews}
            reviewStats={data.reviewStats}
            isLoading={isLoading}
          />
        )}
      </BusinessDetailBottomTab.Screen>
      {!isLoading && data.shop && data.shop.status === 'enabled' ? (
        <BusinessDetailBottomTab.Screen
          initialParams={{ shop: data.shop }}
          name="Menu"
          component={BusinessProductsScreen}
          options={{
            title: data.type === 'restaurant' ? 'Menu' : 'Products',
            tabBarIcon: ({ color }) => {
              return <Icon solid color={color} name="elementor" size={25} />;
            },
          }}
        />
      ) : null}
    </BusinessDetailBottomTab.Navigator>
  );
}
