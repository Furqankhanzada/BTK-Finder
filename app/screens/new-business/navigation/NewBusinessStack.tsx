import { createStackNavigator } from '@react-navigation/stack';

import React from 'react';
import { NewBusinessParamList } from '../../../navigation/models/NewBusinessParamList';
import { NameScreen } from '../name/NameScreen';
import { DescriptionScreen } from '../description/DescriptionScreen';
import { CategoryScreen } from '../category/CategoryScreen';
import { FacilitiesScreen } from '../facilities/FacilitiesScreen';
import { TagsScreen } from '../tags/TagsScreen';
import { TelephoneScreen } from '../telephone/TelephoneScreen';
import { EmailScreen } from '../email/EmailScreen';
import { WebsiteScreen } from '../website/WebsiteScreen';
import { AddressScreen } from '../address/AddressScreen';
import { Hours } from '../hours/Hours';
import { PriceRange } from '../price/PriceRange';
import { GalleryScreen } from '../gallery/GalleryScreen';
import {
  LastRoutes,
  withAuthRedirection,
} from '../../../navigation/hoc/withAuthRedirection';

const NewBusinessStack = createStackNavigator<NewBusinessParamList>();

export function NewBusinessStackNavigator() {
  return (
    <NewBusinessStack.Navigator screenOptions={{ headerShown: false }}>
      <NewBusinessStack.Screen
        name="Name"
        component={withAuthRedirection(NameScreen, {
          lastRoute: LastRoutes.NewBusinessStack,
        })}
      />
      <NewBusinessStack.Screen
        name="Description"
        component={DescriptionScreen}
      />
      <NewBusinessStack.Screen name="Category" component={CategoryScreen} />
      <NewBusinessStack.Screen name="Facilities" component={FacilitiesScreen} />
      <NewBusinessStack.Screen name="Tags" component={TagsScreen} />
      <NewBusinessStack.Screen name="Telephone" component={TelephoneScreen} />
      <NewBusinessStack.Screen name="Email" component={EmailScreen} />
      <NewBusinessStack.Screen name="Website" component={WebsiteScreen} />
      <NewBusinessStack.Screen name="Address" component={AddressScreen} />
      <NewBusinessStack.Screen name="Hours" component={Hours} />
      <NewBusinessStack.Screen name="Price" component={PriceRange} />
      <NewBusinessStack.Screen name="Gallery" component={GalleryScreen} />
    </NewBusinessStack.Navigator>
  );
}
