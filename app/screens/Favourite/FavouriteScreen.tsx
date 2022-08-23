import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { BaseStyle } from '@config';
import { Header, SafeAreaView, CardList, Text } from '@components';
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
      <Header title="Favorite Businesses" />
      {favorites.length ? (
        <FlatList
          style={styles.containerStyle}
          data={favorites}
          keyExtractor={(item) => item._id}
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
      ) : (
        <View style={styles.sectionEmpty}>
          <Text semibold style={styles.sectionEmptyText}>
            No Favorite Businesses Available
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  sectionEmptyText: {
    textAlign: 'center',
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
});
