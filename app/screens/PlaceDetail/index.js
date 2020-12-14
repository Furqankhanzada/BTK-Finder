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

export default function FinalReview({ navigation }) {
  const dispatch = useDispatch();
  const stateProps = useSelector(({ businesses }) => {
    return {
      singleBusiness: businesses.singleBusiness,
      getSingleBusinessLoading: businesses.getSingleBusinessLoading,
    };
  });

  useEffect(() => {
    dispatch(getSingleBusiness());
  }, [dispatch]);

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      {stateProps.getSingleBusinessLoading ? (
        <Loading loading={true} />
      ) : (
        <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always' }}>
          <Header
            title={'Place Detail'}
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
          <PlaceDetailComponent business={stateProps.singleBusiness} />
        </SafeAreaView>
      )}
    </View>
  );
}
