import React from 'react';
import { StyleSheet, FlatList } from 'react-native';

import { PlaceItem } from '@components';
import { useBusinesses } from '@screens/businesses/queries/queries';
import { BusinessPresentable } from '@screens/businesses/models/BusinessPresentable';
import { BusinessParams } from '@screens/businesses/models/BusinessParams';

interface Props {
  queryKey: Array<string | number>;
  params?: BusinessParams;
  onPress: (item: BusinessPresentable) => void;
}

export default function HorizontalBusinesses({
  queryKey,
  params,
  onPress,
}: Props) {
  const { data: businesses } = useBusinesses(queryKey, params);

  return (
    <FlatList
      contentContainerStyle={styles.contentContainerStyle}
      data={businesses}
      horizontal={true}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => {
        return (
          <PlaceItem
            grid
            image={item?.thumbnail}
            title={item.name}
            // subtitle={item.category}
            // location={item?.address}
            rate={item?.averageRatings || 0.0}
            // isFavorite={stateProps?.favoriteBusinesses?.some(
            //   (obj: any) => obj._id === item?._id,
            // )}
            businessId={item?._id}
            // navigation={navigation}
            // lastRoute="Home"
            // status='Open Now'
            onPress={() => onPress(item)}
            style={styles.item}
          />
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingLeft: 20,
  },
  item: {
    marginRight: 15,
    width: 120,
  },
});
