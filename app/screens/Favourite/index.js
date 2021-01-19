import React from 'react';
import { FlatList, View } from 'react-native';
import { BaseStyle } from '@config';
import { Header, SafeAreaView, Text } from '@components';
import styles from '../Place/styles';

export default function Favourite({ navigation }) {
  const listEmptyComponent = () => {
    return (
      <View style={styles.sectionEmpty}>
        <Text semibold style={styles.sectionEmptyText}>
          No Favourite Available
        </Text>
      </View>
    );
  };

  const navigateBusinessDetail = (id) => {
    navigation.navigate('PlaceDetail', { id });
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <Header title="Favourite Businesses" />
      {/*<View style={{ flex: 1 }}>*/}
      {/*  <Loading loading={stateProps.loading} />*/}
      {/*  <FlatList*/}
      {/*    contentContainerStyle={{*/}
      {/*      paddingHorizontal: 20,*/}
      {/*      paddingTop: 15,*/}
      {/*      flex: stateProps?.data?.length ? 0 : 1,*/}
      {/*    }}*/}
      {/*    data={[]}*/}
      {/*    ListEmptyComponent={listEmptyComponent}*/}
      {/*    keyExtractor={(item, index) => item.id}*/}
      {/*    renderItem={({ item, index }) => {*/}
      {/*      return (*/}
      {/*        <CardList*/}
      {/*          image={item?.thumbnail}*/}
      {/*          title={item?.name}*/}
      {/*          subtitle={item?.category}*/}
      {/*          rate={item?.averageRatings}*/}
      {/*          style={{ marginBottom: 15 }}*/}
      {/*          onPress={() => navigateBusinessDetail(item._id)}*/}
      {/*        />*/}
      {/*      );*/}
      {/*    }}*/}
      {/*  />*/}
      {/*</View>*/}
      <View style={{ flex: 1, paddingTop: 100 }}>
        <Text semibold style={styles.sectionEmptyText}>
          Favourite Businesses Will Appear Here
        </Text>
      </View>
    </SafeAreaView>
  );
}
