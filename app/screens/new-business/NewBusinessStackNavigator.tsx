import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { NewBusinessParamList } from '../../navigation/models/NewBusinessParamList';
import {
  LastRoutes,
  withAuthRedirection,
} from '../../navigation/hoc/withAuthRedirection';
import { NameScreen } from './name/NameScreen';
import { DescriptionScreen } from './description/DescriptionScreen';
import { CategorySelectScreen } from './category/CategorySelectScreen';
import { FacilitiesScreen } from './facilities/FacilitiesScreen';
import { TagsScreen } from './tags/TagsScreen';
import { TelephoneScreen } from './telephone/TelephoneScreen';
import { AddressScreen } from './address/AddressScreen';

const NewBusinessStack = createStackNavigator<NewBusinessParamList>();

export default function NewBusinessStackNavigator() {
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
      <NewBusinessStack.Screen
        name="CategorySelect"
        component={CategorySelectScreen}
      />
      <NewBusinessStack.Screen name="Facilities" component={FacilitiesScreen} />
      <NewBusinessStack.Screen name="Tags" component={TagsScreen} />
      <NewBusinessStack.Screen name="Telephone" component={TelephoneScreen} />
      <NewBusinessStack.Screen name="Address" component={AddressScreen} />
    </NewBusinessStack.Navigator>
  );
}
