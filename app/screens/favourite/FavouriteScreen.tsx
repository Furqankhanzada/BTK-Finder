import React, { useState } from 'react';
import { FlatList, StyleSheet, View, RefreshControl } from 'react-native';

import { BaseStyle, useTheme } from '@config';
import { SafeAreaView, CardList, Text, Header } from '@components';
import { useBusinesses } from '@screens/businesses/queries/queries';

import FavouritePlaceHolder from '../favourite/components/FavouritePlaceholder';

interface Props {
  navigation: any;
}

export default function FavouriteScreen(props: Props) {
  const { navigation } = props;
  const { colors } = useTheme();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const {
    isLoading,
    data: favorites,
    refetch,
  } = useBusinesses(['favourite-businesses'], {
    favorite: true,
    skip: 0,
    fields: 'name, thumbnail, category, averageRatings',
  });

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const navigateToBusinessDetail = (id: string) => {
    navigation.navigate('BusinessDetailTabNavigator', { businessId: id });
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header title="Favorite Businesses" />
      {isLoading ? (
        <View style={styles.placeHolderContainer}>
          <FavouritePlaceHolder />
        </View>
      ) : (
        <FlatList
          refreshControl={
            <RefreshControl
              title="Pull to refresh"
              titleColor={colors.text}
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={isRefreshing}
              onRefresh={onRefresh}
            />
          }
          style={styles.containerStyle}
          data={favorites}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={
            <View style={styles.sectionEmpty}>
              <Text semibold textAlign="center" headline>
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
                onPress={() => navigateToBusinessDetail(item._id)}
              />
            );
          }}
        />
      )}
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
  scrollViewDiv: {
    flex: 1,
  },
  cardListMargin: {
    marginBottom: 15,
  },
  containerStyle: {
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  placeHolderContainer: {
    paddingHorizontal: 20,
  },
});
