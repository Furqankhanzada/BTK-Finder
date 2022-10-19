import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text, Tag, Image } from '@components';
import { CatalogProduct, CatalogProductVariant } from '../../../models/graphql';
import EcommerceButton from '@screens/businesses/components/EcommerceButton';
import { useTheme, Images } from '@config';
import QuantityButton from '@screens/businesses/components/QuantityButton';
import * as Utils from '@utils';

export default function Product({ item }: { item: CatalogProduct }) {
  const { colors } = useTheme();
  const [selectedVariant, setSelectedVariant] =
    useState<CatalogProductVariant | null>();
  const [quantity, setQuantity] = useState<number>(1);

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
      <Image
        source={
          item.primaryImage?.URLs?.medium
            ? {
                uri: item.primaryImage?.URLs?.medium,
              }
            : Images.imagePlaceholder
        }
        style={styles.image}
      />
      <Text title1 heavy>
        {item.title}
      </Text>
      <Text caption1>{item.description}</Text>
      <Text headline style={{ marginTop: 10 }}>
        Select Size:
      </Text>
      <View style={[styles.variantsContainer]}>
        {item.variants?.map((variant) => (
          <Tag
            key={variant?._id}
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

      <View style={styles.priceQuantity}>
        <Text heavy headline style={{ width: '40%' }}>
          Rs.
          {selectedVariant?.pricing.map((price) =>
            (price?.price! * quantity)
              .toFixed(2)
              .replace(/\d(?=(\d{3})+\.)/g, '$&,'),
          )}
        </Text>
        <QuantityButton
          onPressAdd={() => setQuantity((oldQuantity) => oldQuantity + 1)}
          onPressRemove={() =>
            setQuantity((oldQuantity) =>
              oldQuantity !== 1 ? oldQuantity - 1 : oldQuantity,
            )
          }
          quantity={quantity}
        />
      </View>
      <EcommerceButton
        leftText="Rs.0"
        title="Add to cart"
        rightText={'0'}
        onPress={() => {}}
        onCartCountPress={() => {}}
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
  image: {
    width: '100%',
    height: Utils.scaleWithPixel(200),
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 15,
  },
  priceQuantity: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 10,
  },
});
