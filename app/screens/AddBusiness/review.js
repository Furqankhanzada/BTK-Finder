import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  CustomStepIndicator,
  PlaceDetailComponent,
  Loading,
} from '@components';
import ActionButton from 'react-native-action-button';
import { useDispatch, useSelector } from 'react-redux';
import {
  createBusiness,
  getMyBusinesses,
  updateBusiness,
} from '../../actions/business';

export default function FinalReview({ navigation }) {
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const stateProps = useSelector(({ businesses }) => businesses);
  const profileData = useSelector((state) => state.profile);

  const {
    businessFormData,
    createBusinessLoading,
    thumbnail,
    gallery,
    editBusinessLoading,
  } = stateProps;

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
    if (thumbnail) {
      payload.thumbnail = thumbnail;
    }
    if (gallery) {
      payload.gallery = gallery;
    }
    if (businessFormData.editBusiness) {
      dispatch(
        updateBusiness(payload, businessFormData._id, editBusinessCallback),
      );
    } else {
      dispatch(createBusiness(payload, addCallback));
    }
  };

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <Loading loading={createBusinessLoading} />
      <Loading loading={editBusinessLoading} />
      <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always' }}>
        <Header
          title={
            businessFormData?.editBusiness
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
          disabled={createBusinessLoading}
          icon={<Icon name="check" size={20} color="white" enableRTL={true} />}
        />
      </SafeAreaView>
    </View>
  );
}
