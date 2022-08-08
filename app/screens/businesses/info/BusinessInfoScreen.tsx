import React from 'react';
import { StyleSheet, View } from 'react-native';

import Detail from './components/Detail';

export default function PlaceDetail(props: any) {
  const { navigateTo, business, isLoading } = props;
  return (
    <View style={styles.container}>
      <Detail
        business={business}
        isLoading={isLoading}
        navigateTo={navigateTo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
});
