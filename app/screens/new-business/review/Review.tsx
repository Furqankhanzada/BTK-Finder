import React from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  SafeAreaView,
  PlaceDetailComponent,
  Loading,
  FloatingButton,
} from '@components';

import {
  createBusiness,
  getMyBusinesses,
  updateBusiness,
} from '../../../actions/business';

export default function Review({ navigation }) {
  const dispatch = useDispatch();

  const stateProps = useSelector(({ businesses }) => {
    return {
      createBusinessLoading: businesses.createBusinessLoading,
      thumbnail: businesses.thumbnail,
      gallery: businesses.gallery,
      editBusinessLoading: businesses.editBusinessLoading,
      editBusiness: businesses.editBusiness,
      editBusinessData: businesses.editBusinessData,
      businessFormData: businesses.businessFormData,
    };
  });
  const businessFormData = stateProps?.editBusiness
    ? stateProps?.editBusinessData
    : stateProps?.businessFormData;
  const profileData = useSelector((state: any) => state.profile);

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
    let payload = { ...businessFormData };
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
    if (stateProps.thumbnail) {
      payload.thumbnail = stateProps.thumbnail;
    }
    if (stateProps.gallery) {
      payload.gallery = stateProps.gallery;
    }
    if (stateProps.editBusiness) {
      dispatch(
        updateBusiness(payload, businessFormData._id, editBusinessCallback),
      );
    } else {
      dispatch(createBusiness(payload, addCallback));
    }
  };

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <Loading loading={stateProps.createBusinessLoading} />
      <Loading loading={stateProps.editBusinessLoading} />
      <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always' }}>
        <PlaceDetailComponent
          business={businessFormData}
          preview={true}
          navigation={navigation}
        />
        <FloatingButton iconName="check" onPress={() => add()} />
      </SafeAreaView>
    </View>
  );
}
