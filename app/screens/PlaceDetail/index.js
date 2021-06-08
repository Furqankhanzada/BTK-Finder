import React, { useEffect } from 'react';
import { View } from 'react-native';
import {
  Header,
  SafeAreaView,
  Icon,
  PlaceDetailComponent,
  Loading,
} from '@components';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleBusiness } from '../../actions/business';

export default function PlaceDetail(props) {
  const {navigation, route} = props;
  const dispatch = useDispatch();
  const stateProps = useSelector(({ businesses }) => {
    return {
      singleBusiness: businesses.singleBusiness,
      getSingleBusinessLoading: businesses.getSingleBusinessLoading,
    };
  });

  useEffect(() => {
    dispatch(getSingleBusiness(route?.params?.id));
  }, []);

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <PlaceDetailComponent business={stateProps.singleBusiness} navigation={navigation} />
    </View>
  );
}
