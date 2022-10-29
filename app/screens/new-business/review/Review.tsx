import React from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  SafeAreaView,
  PlaceDetailComponent,
  Loading,
  FloatingButton,
} from '../../../components';

import {
  createBusiness,
  getMyBusinesses,
  updateBusiness,
} from '../../../actions/business';
import useAddBusinessStore from '../store/Store';

export default function Review({ navigation }) {
  const dispatch = useDispatch();

  const businessStore = useAddBusinessStore((state: any) => state);

  console.log('UPDATED STORE IN REVIEW SCREEN', businessStore);

  const addCallback = () => {
    navigation.navigate('Home');
  };

  const editBusinessCallback = () => {
    dispatch(
      getMyBusinesses({
        skip: 0,
        limit: 10,
        recent: true,
        fields: 'name, thumbnail, category, averageRatings',
        ownerId: profileData?._id,
      }),
    );
    navigation.navigate('MyBusinesses');
  };

  const add = () => {
    let payload = { ...businessStore };
    let openHours: { day: any; to: any; from: any }[] = [];
    if (payload.openHours) {
      payload.openHours.forEach((obj: any) => {
        if (obj.isOpen && (obj.to || obj.from)) {
          openHours.push({
            day: obj.day,
            to: obj.to,
            from: obj.from,
          });
        }
      });
    }
    if (!payload.telephone) {
      delete payload.telephone;
    }
    if (!payload.email) {
      delete payload.email;
    }
    if (!payload.website) {
      delete payload.website;
    }
    payload.openHours = openHours;
    if (businessStore.thumbnail) {
      payload.thumbnail = businessStore.thumbnail;
    }
    if (businessStore.gallery) {
      payload.gallery = businessStore.gallery;
    }
    if (businessStore.editBusiness) {
      dispatch(
        updateBusiness(payload, businessStore._id, editBusinessCallback),
      );
    } else {
      dispatch(createBusiness(payload, addCallback));
    }
  };

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <PlaceDetailComponent
          business={businessStore}
          preview={true}
          navigation={navigation}
        />
        <FloatingButton iconName="check" />
      </SafeAreaView>
    </View>
  );
}
