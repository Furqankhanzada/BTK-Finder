import React from 'react';
import { View } from 'react-native';

import { Text } from '@components';
import { CatalogProduct } from '../../../models/graphql';
import EcommerceButton from '@screens/businesses/components/EcommerceButton';

export default function Product({ item }: { item: CatalogProduct }) {
  return (
    <View style={{ width: '100%' }}>
      <Text title3>{item.title}</Text>
      <Text caption1>{item.pricing[0]?.displayPrice}</Text>
      <Text>{item.description}</Text>
      <EcommerceButton
        leftText="Rs.20"
        title="Add to cart"
        rightText={3}
        onPress={() => {}}
      />
    </View>
  );
}
