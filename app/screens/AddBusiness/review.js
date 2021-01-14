import React from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ActionButton from 'react-native-action-button';
import { useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  CustomStepIndicator,
  PlaceDetailComponent,
  Loading,
} from '@components';
import {
  createBusiness,
  getMyBusinesses,
  updateBusiness,
} from '../../actions/business';

export default function FinalReview({ navigation }) {
  const { colors } = useTheme();
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
  const profileData = useSelector((state) => state.profile);

  const addCallback = () => {
    navigation.navigate('Home');
  };

  const editBusinessCallback = () => {
    dispatch(
      getMyBusinesses({
        skip: 0,
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
    <View style={{ flex: 1, position: 'relative' }}>
      <Loading loading={stateProps.createBusinessLoading} />
      <Loading loading={stateProps.editBusinessLoading} />
      <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always' }}>
        <Header
          title={
            stateProps?.editBusiness
              ? 'Edit Your Business'
              : 'Add Your Business'
          }
          renderLeft={() => {
            return (
              <Icon
                name="arrow-left"
                size={20}
                color="#5dade2"
                enableRTL={true}
              />
            );
          }}
          onPressLeft={() => {
            navigation.goBack();
          }}
        />
        <CustomStepIndicator position={5} />
        <PlaceDetailComponent
          business={businessFormData}
          navigation={navigation}
        />
        <ActionButton
          buttonColor={colors.primary}
          nativeFeedbackRippleColor="transparent"
          onPress={() => add()}
          offsetX={20}
          offsetY={10}
          disabled={stateProps.createBusinessLoading}
          icon={<Icon name="check" size={20} color="white" enableRTL={true} />}
        />
      </SafeAreaView>
    </View>
  );
}
