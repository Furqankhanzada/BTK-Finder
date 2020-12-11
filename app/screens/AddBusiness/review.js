import React from 'react';
import { View } from 'react-native';
import {
  Header,
  SafeAreaView,
  Icon,
  CustomStepIndicator,
  PlaceDetailComponent,
  Loading
} from '@components';
import ActionButton from 'react-native-action-button';
import {useDispatch, useSelector} from "react-redux";
import {createBusiness} from "../../actions/business";

export default function FinalReview({ navigation }) {
  const dispatch = useDispatch();

  const stateProps = useSelector(({businesses}) => businesses);

  const { businessFormData, createBusinessLoading } = stateProps;

  const addCallback = () => {
    navigation.navigate('Home');
  };

  const add = () => {
    let payload = {...businessFormData};
    let openHours = [];
    if(payload.openHours) {
      payload.openHours.forEach((obj) => {
        if(obj.isOpen && (obj.to || obj.from)){
          openHours.push({
            day: obj.day,
            to: obj.to,
            from: obj.from
          })
        }
      })
    }
    payload.openHours = openHours;
    dispatch(createBusiness(payload, addCallback))
  };

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <Loading loading={createBusinessLoading}/>
      <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always' }}>
        <Header
          title={'Add Your Business'}
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
        <CustomStepIndicator position={4} />
        <PlaceDetailComponent business={businessFormData} />
        <ActionButton
          buttonColor="rgba(93, 173, 226, 1)"
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
