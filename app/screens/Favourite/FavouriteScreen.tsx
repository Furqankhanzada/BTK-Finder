import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { BaseStyle } from '@config';
import { SafeAreaView, CardList, Text } from '@components';
import { useBusinesses } from '@screens/businesses/queries/queries';

export default function FavouriteScreen({ navigation }: any) {
  const { isLoading, data: favorites } = useBusinesses(
    ['favourite-businesses'],
    {
      favorite: true,
      skip: 0,
      fields: 'name, thumbnail, category, averageRatings',
    },
  );

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  const navigateBusinessDetail = (id: string) => {
    navigation.navigate('BusinessDetailTabNavigator', { id });
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <FlatList
        ListHeaderComponent={
          <Text style={styles.headerText}>Favorite Businesses</Text>
        }
        style={styles.containerStyle}
        data={favorites}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <View style={styles.sectionEmpty}>
            <Text semibold style={styles.sectionEmptyText}>
              No Favorite Businesses Available
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          return (
            <CardList
              image={item?.thumbnail}
              title={item?.name}
              subtitle={item?.category}
              rate={item?.averageRatings}
              style={styles.cardListMargin}
              onPress={() => navigateBusinessDetail(item._id)}
            />
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionEmpty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    height: 100,
  },
  sectionEmptyText: {
    textAlign: 'center',
    fontSize: 16,
  },
  scrollViewDiv: {
    flex: 1,
  },
  cardListMargin: {
    marginBottom: 15,
  },
  containerStyle: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  headerText: {
    height: 45,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 22,
  },
});
