import React from 'react';
import { StyleSheet, View } from 'react-native';

import Detail from './components/Detail';
import { useBusiness } from '../queries/queries';

export default function BusinessInfoScreen(props: any) {
  const { navigation, route } = props;
  const { isLoading, data: business } = useBusiness(route?.params?.id);

  return (
    <View style={styles.container}>
      <Detail
        business={business}
        isLoading={isLoading}
        navigation={navigation}
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
