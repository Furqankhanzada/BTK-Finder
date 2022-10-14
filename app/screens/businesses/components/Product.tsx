import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text, Tag } from '@components';
import { CatalogProduct, CatalogProductVariant } from '../../../models/graphql';
import EcommerceButton from '@screens/businesses/components/EcommerceButton';
import { useTheme } from '@config';
import QuantityButton from '@screens/businesses/components/QuantityButton';

export default function Product({ item }: { item: CatalogProduct }) {
  const { colors } = useTheme();
  const [selectedVariant, setSelectedVariant] =
    useState<CatalogProductVariant | null>();
  const [quantity, setQuantity] = useState<number>(0);

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
      <Text headline style={{ marginTop: 10 }}>
        Select Size:
      </Text>
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
      <Text body1 style={{ paddingVertical: 10 }}>
        Special Sauce-Aghani-Cheese: Mushroom-Jalapeño
      </Text>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 10,
        }}>
        <Text heavy headline style={{ width: '40%' }}>
          {selectedVariant?.pricing.map((price) => price?.displayPrice)}
        </Text>
        <QuantityButton
          onPressAdd={() => setQuantity((oldQuantity) => oldQuantity + 1)}
          onPressRemove={() =>
            setQuantity((oldQuantity) =>
              oldQuantity !== 0 ? oldQuantity - 1 : oldQuantity,
            )
          }
          quantity={quantity}
        />
      </View>
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
  },
  variant: {
    marginRight: 5,
  },
  listEmptyText: {
    textAlign: 'center',
    paddingVertical: 20,
  },
});
