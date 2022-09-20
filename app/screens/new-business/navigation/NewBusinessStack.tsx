import { createStackNavigator } from '@react-navigation/stack';

import React from 'react';
import { NewBusinessParamList } from '../../../navigation/models/NewBusinessParamList';
import { NameScreen } from '../name/NameScreen';
import { DiscriptionScreen } from '../discription/DiscriptionScreen';
import { CategoryScreen } from '../category/CategoryScreen';
import { FacilitiesScreen } from '../facilities/FacilitiesScreen';
import { TagsScreen } from '../tags/TagsScreen';
import { TelephoneScreen } from '../telephone/TelephoneScreen';
import { EmailScreen } from '../email/EmailScreen';
import { WebsiteScreen } from '../website/WebsiteScreen';
import { EstablishedScreen } from '../established/EstablishedScreen';
import { AddressScreen } from '../address/AddressScreen';
import { Hours } from '../hours/Hours';
import { PriceRange } from '../price/PriceRange';
import { GalleryScreen } from '../gallery/GalleryScreen';
import { NewBusinessProvider } from '../context/NewBusinessProvider';

const NewBusinessStack = createStackNavigator<NewBusinessParamList>();

export function NewBusinessStackNavigator() {
  return (
    <NewBusinessProvider>
      <NewBusinessStack.Navigator screenOptions={{ headerShown: false }}>
        <NewBusinessStack.Screen name="Name" component={NameScreen} />
        <NewBusinessStack.Screen
          name="Discription"
          component={DiscriptionScreen}
        />
        <NewBusinessStack.Screen name="Category" component={CategoryScreen} />
        <NewBusinessStack.Screen
          name="Facilities"
          component={FacilitiesScreen}
        />
        <NewBusinessStack.Screen name="Tags" component={TagsScreen} />
        <NewBusinessStack.Screen name="Telephone" component={TelephoneScreen} />
        <NewBusinessStack.Screen name="Email" component={EmailScreen} />
        <NewBusinessStack.Screen name="Website" component={WebsiteScreen} />
        <NewBusinessStack.Screen
          name="Established"
          component={EstablishedScreen}
        />
        <NewBusinessStack.Screen name="Address" component={AddressScreen} />
        <NewBusinessStack.Screen name="Hours" component={Hours} />
        <NewBusinessStack.Screen name="Price" component={PriceRange} />
        <NewBusinessStack.Screen name="Gallery" component={GalleryScreen} />
      </NewBusinessStack.Navigator>
    </NewBusinessProvider>
  );
}
