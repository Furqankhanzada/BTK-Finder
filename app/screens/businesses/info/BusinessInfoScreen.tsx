import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import Detail from './components/Detail';
import { getSingleBusiness } from '../../../actions/business';

export default function PlaceDetail(props: any) {
  const { navigation, route } = props;
  const dispatch = useDispatch();
  const stateProps = useSelector(({ businesses }: any) => {
    return {
      singleBusiness: businesses.singleBusiness,
      getSingleBusinessLoading: businesses.getSingleBusinessLoading,
    };
  });

  useEffect(() => {
    if (route?.params?.id) {
      dispatch(getSingleBusiness(route?.params?.id));
    }
  }, [dispatch, route?.params?.id]);

  return (
    <View style={styles.container}>
      <Detail business={stateProps.singleBusiness} navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});
