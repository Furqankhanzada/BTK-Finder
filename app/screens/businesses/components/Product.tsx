import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text, Tag, Image } from '@components';
import { CatalogProduct, CatalogProductVariant } from '../../../models/graphql';
import EcommerceButton from '@screens/businesses/components/EcommerceButton';
import { useTheme, Images } from '@config';
import QuantityButton from '@screens/businesses/components/QuantityButton';
import * as Utils from '@utils';
import { useAlerts } from '@hooks';
import { IconName } from '../../../contexts/alerts-v2/models/Icon';

export default function Product({
  item,
  onDismiss,
}: {
  item: CatalogProduct;
  onDismiss: (arg?: any) => void;
}) {
  const { colors } = useTheme();
  const { showAlert } = useAlerts();
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

  const onAddToCartPress = async () => {
    onDismiss();
    await showAlert({
      icon: {
        size: 70,
        name: IconName.ConstructOutline,
        color: colors.primary,
      },
      title: 'Under Development',
      message: 'This feature is under development, will be available soon!',
      btn: {
        confirmBtnTitle: 'Ok',
      },
      type: 'Standard',
    });
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
        onPress={onAddToCartPress}
        onCartCountPress={onAddToCartPress}
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
