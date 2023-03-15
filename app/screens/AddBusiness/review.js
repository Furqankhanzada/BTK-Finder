import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useFocusEffect } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import {
  SafeAreaView,
  PlaceDetailComponent,
  Loading,
  FloatingButton,
} from '@components';
import { BaseStyle } from '@config';
import { useGetProfile } from '@screens/settings/profile/queries/queries';

import {
  createBusiness,
  getMyBusinesses,
  updateBusiness,
} from '../../actions/business';

export default function FinalReview({ navigation }) {
  const dispatch = useDispatch();

  const queryClient = useQueryClient();

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
  const { data: profileData } = useGetProfile();

  useFocusEffect(
    React.useCallback(() => {
      if (!businessFormData || !Object.keys(businessFormData).length) {
        navigation.navigate('Dashboard');
      }
    }, [stateProps?.editBusinessData, stateProps?.businessFormData]),
  );

  const addCallback = () => {
    queryClient.invalidateQueries(['my-business']);
    queryClient.invalidateQueries(['recent-businesses']);

    navigation.navigate('MyBusinesses');
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
    let openHours = [];
    if (payload.openHours) {
      payload.openHours.forEach((obj) => {
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
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <Loading loading={stateProps.createBusinessLoading} />
      <Loading loading={stateProps.editBusinessLoading} />
      <PlaceDetailComponent
        business={businessFormData}
        preview={true}
        navigation={navigation}
      />
      <FloatingButton iconName="check" onPress={() => add()} />
    </SafeAreaView>
  );
}
