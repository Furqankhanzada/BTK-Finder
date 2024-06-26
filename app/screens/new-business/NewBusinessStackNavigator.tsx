import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { AuthStackNavigator } from '@screens/auth/navigation/AuthStack';
import useAuthStore, { AuthStoreStates } from '@screens/auth/store/Store';

import { NewBusinessParamList } from '../../navigation/models/NewBusinessParamList';
import NameScreen from './name/NameScreen';
import DescriptionScreen from './description/DescriptionScreen';
import CategorySelectScreen from './category/CategorySelectScreen';
import FacilitiesScreen from './facilities/FacilitiesScreen';
import TagsScreen from './tags/TagsScreen';
import TelephoneScreen from './telephone/TelephoneScreen';
import EmailScreen from './email/EmailScreen';
import WebsiteScreen from './website/WebsiteScreen';
import AddressScreen from './address/AddressScreen';
import OpenHoursScreen from './hours/OpenHoursScreen';
import PricingScreen from './pricing/PricingScreen';
import GalleryScreen from './gallery/GalleryScreen';

const NewBusinessStack = createStackNavigator<NewBusinessParamList>();

export default function NewBusinessStackNavigator() {
  const isLogin = useAuthStore((state: AuthStoreStates) => state.isLogin);

  return (
    <NewBusinessStack.Navigator screenOptions={{ headerShown: false }}>
      <NewBusinessStack.Screen
        name="Name"
        component={isLogin ? NameScreen : AuthStackNavigator}
      />
      <NewBusinessStack.Screen
        name="Description"
        component={DescriptionScreen}
      />
      <NewBusinessStack.Screen
        name="CategorySelect"
        component={CategorySelectScreen}
      />
      <NewBusinessStack.Screen name="Facilities" component={FacilitiesScreen} />
      <NewBusinessStack.Screen name="Tags" component={TagsScreen} />
      <NewBusinessStack.Screen name="Telephone" component={TelephoneScreen} />
      <NewBusinessStack.Screen name="Email" component={EmailScreen} />
      <NewBusinessStack.Screen name="Website" component={WebsiteScreen} />
      <NewBusinessStack.Screen name="Address" component={AddressScreen} />
      <NewBusinessStack.Screen name="OpenHours" component={OpenHoursScreen} />
      <NewBusinessStack.Screen name="Pricing" component={PricingScreen} />
      <NewBusinessStack.Screen name="Gallery" component={GalleryScreen} />
    </NewBusinessStack.Navigator>
  );
}
