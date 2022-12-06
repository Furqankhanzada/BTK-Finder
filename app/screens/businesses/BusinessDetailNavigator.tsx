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
import ProductDetailScreen from '@screens/businesses/product-detail/ProductDetailScreen';
import { useBusiness } from '@screens/businesses/queries/queries';
import {
  BusinessType,
  ShopStatus,
} from '@screens/businesses/models/BusinessPresentable';

import BusinessReviewsScreen from './reviews/BusinessReviewsScreen';
import BusinessOverviewScreen from './info/BusinessOverviewScreen';
import BusinessProductsScreen from './products/BusinessProductsScreen';
import AddReviewScreen from './add-review/AddReviewScreen';
import CartScreen from './cart/CartScreen';
import {
  BusinessDetailBottomTabParamList,
  ProductStackParamList,
  ReviewStackParamList,
} from '../../navigation/models/BusinessDetailBottomTabParamList';
import { MainStackParamList } from '../../navigation/models/MainStackParamList';

const BusinessDetailBottomTab =
  createBottomTabNavigator<BusinessDetailBottomTabParamList>();

const ReviewStack = createStackNavigator<ReviewStackParamList>();

function ReviewStackNavigator({}: StackScreenProps<
  BusinessDetailBottomTabParamList,
  'ReviewStack'
>) {
  return (
    <ReviewStack.Navigator screenOptions={{ headerShown: false }}>
      <ReviewStack.Screen name="Reviews" component={BusinessReviewsScreen} />
      <ReviewStack.Screen name="AddReview" component={AddReviewScreen} />
    </ReviewStack.Navigator>
  );
}

const ProductStack = createStackNavigator<ProductStackParamList>();

function ProductStackNavigator() {
  return (
    <ProductStack.Navigator screenOptions={{ headerShown: false }}>
      <ProductStack.Screen name="Overview" component={BusinessOverviewScreen} />
      <ProductStack.Screen name="Product" component={ProductDetailScreen} />
      <ProductStack.Screen name="Cart" component={CartScreen} />
    </ProductStack.Navigator>
  );
}

export default function BusinessDetailNavigator({
  route,
}: BottomTabScreenProps<MainStackParamList, 'BusinessDetailTabNavigator'>) {
  const businessId = route.params.businessId;
  const { colors } = useTheme();
  const font = useFont();
  const { isLoading, data } = useBusiness(businessId);

  return (
    <BusinessDetailBottomTab.Navigator
      initialRouteName="DetailStack"
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
        name="DetailStack"
        initialParams={{
          screen: 'Overview',
          params: { businessId: businessId },
        }}
        options={{
          title: 'Overview',
          tabBarIcon: ({ color }) => {
            return <Icon color={color} name="info-circle" size={25} solid />;
          },
        }}
        component={ProductStackNavigator}
      />
      <BusinessDetailBottomTab.Screen
        name="ReviewStack"
        initialParams={{
          screen: 'Reviews',
          params: { businessId: businessId },
        }}
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
          initialParams={{ businessId: businessId }}
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
