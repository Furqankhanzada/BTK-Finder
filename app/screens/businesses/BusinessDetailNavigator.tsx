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
  MembershipsStatus,
  ShopStatus,
} from '@screens/businesses/models/BusinessPresentable';
import { useProfile } from '@screens/settings/profile/queries/queries';

import { getProductsTitle } from './helpers/getProductsTitle';
import BusinessReviewsScreen from './reviews/BusinessReviewsScreen';
import BusinessOverviewScreen from './info/BusinessOverviewScreen';
import BusinessProductsScreen from './products/BusinessProductsScreen';
import AddReviewScreen from './add-review/AddReviewScreen';
import {
  BusinessDetailBottomTabParamList,
  MembersStackParamList,
  ProductStackParamList,
  ReviewStackParamList,
} from '../../navigation/models/BusinessDetailBottomTabParamList';
import { MainStackParamList } from '../../navigation/models/MainStackParamList';
import BusinessMembersScreen from './members/list/BusinessMembersScreen';
import AddBusinessMember from './members/add/AddBusinessMember';
import EditBusinessMember from './members/edit/EditBusinessMember';

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
    </ProductStack.Navigator>
  );
}

const MembersStack = createStackNavigator<MembersStackParamList>();

function MembersStackNavigator({}: StackScreenProps<
  BusinessDetailBottomTabParamList,
  'MembersStack'
>) {
  return (
    <MembersStack.Navigator screenOptions={{ headerShown: false }}>
      <MembersStack.Screen name="Members" component={BusinessMembersScreen} />
      <MembersStack.Screen name="AddMember" component={AddBusinessMember} />
      <MembersStack.Screen name="EditMember" component={EditBusinessMember} />
    </MembersStack.Navigator>
  );
}

export default function BusinessDetailNavigator({
  route,
}: BottomTabScreenProps<MainStackParamList, 'BusinessDetailTabNavigator'>) {
  const businessId = route.params.businessId;
  const { colors } = useTheme();
  const font = useFont();
  const { isLoading, data } = useBusiness(businessId);
  const { data: user } = useProfile();

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
            title: getProductsTitle(data.type),
            tabBarIcon: ({ color }) => {
              return <Icon solid color={color} name="elementor" size={25} />;
            },
          }}
        />
      ) : null}
      {data &&
      data.memberships?.status === MembershipsStatus.enabled &&
      data.ownerId === user?._id ? (
        <BusinessDetailBottomTab.Screen
          initialParams={{
            screen: 'Members',
            params: { businessId: businessId },
          }}
          name="MembersStack"
          component={MembersStackNavigator}
          options={{
            title: 'Members',
            tabBarIcon: ({ color }) => {
              return <Icon solid color={color} name="users" size={25} />;
            },
          }}
        />
      ) : null}
    </BusinessDetailBottomTab.Navigator>
  );
}
