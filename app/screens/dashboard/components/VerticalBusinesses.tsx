import React from 'react';
import { StyleSheet, FlatList } from 'react-native';

import { CardList } from '@components';
import { useBusinesses } from '@screens/businesses/queries/queries';
import { BusinessPresentable } from '@screens/businesses/models/BusinessPresentable';
import { BusinessParams } from '@screens/businesses/models/BusinessParams';

interface Props {
  queryKey: Array<string | number>;
  params?: BusinessParams;
  onPress: (item: BusinessPresentable) => void;
}

export default function VerticalBusinesses({
  queryKey,
  params,
  onPress,
}: Props) {
  const { data: businesses } = useBusinesses(queryKey, params);

  return (
    <FlatList
      listKey={queryKey[0] as string}
      contentContainerStyle={styles.contentContainerStyle}
      data={businesses}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => {
        return (
          <CardList
            key={item._id}
            image={item?.thumbnail}
            title={item.name}
            subtitle={item.category}
            rate={item?.averageRatings || 0.0}
            style={styles.item}
            onPress={() => onPress(item)}
          />
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {},
  item: {
    marginBottom: 15,
    marginLeft: 20,
  },
});
