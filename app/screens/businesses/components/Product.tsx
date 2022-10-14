import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text, Tag } from '@components';
import { CatalogProduct, CatalogProductVariant } from '../../../models/graphql';
import EcommerceButton from '@screens/businesses/components/EcommerceButton';
import { useTheme } from '@config';

export default function Product({ item }: { item: CatalogProduct }) {
  const { colors } = useTheme();
  const [selectedVariant, setSelectedVariant] =
    useState<CatalogProductVariant | null>();

  useEffect(() => {
    if (item.variants && item.variants.length) {
      setSelectedVariant(item.variants[0]);
    }
  }, [item.variants]);

  const onVariantPress = (variant: CatalogProductVariant | null) => {
    setSelectedVariant(variant);
  };

  return (
    <View style={styles.container}>
      <Text title1 heavy>
        {item.title}
      </Text>
      <Text caption1>{item.pricing[0]?.displayPrice}</Text>
      <Text>{item.description}</Text>
      <Text headline>Select Size:</Text>
      <View style={[styles.variantsContainer]}>
        {item.variants?.map((variant) => (
          <Tag
            onPress={() => onVariantPress(variant)}
            rate
            style={[
              styles.variant,
              selectedVariant?.optionTitle === variant?.optionTitle
                ? {
                    backgroundColor: colors.primaryDark,
                  }
                : { backgroundColor: colors.primaryLight },
            ]}>
            {variant?.optionTitle}
          </Tag>
        ))}
      </View>
      <Text heavy headline style={{ marginBottom: 10 }}>
        {selectedVariant?.pricing.map((price) => price?.displayPrice)}
      </Text>
      <EcommerceButton
        leftText="Rs.20"
        title="Add to cart"
        rightText={3}
        onPress={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  variantsContainer: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 10,
  },
  variant: {
    marginRight: 5,
  },
  listEmptyText: {
    textAlign: 'center',
    paddingVertical: 20,
  },
});
