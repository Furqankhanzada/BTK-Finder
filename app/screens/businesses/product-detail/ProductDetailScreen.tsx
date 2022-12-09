import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';

import {
  Header,
  SafeAreaView,
  Icon,
  Image,
  Text,
  Tag,
  Loading,
} from '@components';
import { BaseStyle, Images, useTheme } from '@config';
import { useAlerts } from '@hooks';
import * as Utils from '@utils';
import {
  useBusiness,
  useProductBySlug,
} from '@screens/businesses/queries/queries';
import QuantityButton from '@screens/businesses/components/QuantityButton';
import EcommerceButton from '@screens/businesses/components/EcommerceButton';

import { ProductStackParamList } from '../../../navigation/models/BusinessDetailBottomTabParamList';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { CatalogProductVariant } from '../../../models/graphql';
import { IconName } from '../../../contexts/alerts-v2/models/Icon';
import ProductDetailPlaceholder from './components/ProductDetailPlaceholder';

export default function ProductDetailScreen(
  props: StackScreenProps<ProductStackParamList, 'Product'>,
) {
  const { navigation, route } = props;
  const { data: business } = useBusiness(route.params.businessId!);

  const {
    refetch,
    data: product,
    isLoading,
  } = useProductBySlug(business?.shop?.shopId, route.params.productSlug!);

  const { colors } = useTheme();
  const { t } = useTranslation();

  const { showAlert } = useAlerts();
  const [selectedVariant, setSelectedVariant] =
    useState<CatalogProductVariant | null>();
  const [quantity, setQuantity] = useState<number>(1);
  const [isReFetching, setIsReFetching] = useState<boolean>(false);

  useEffect(() => {
    if (product?.variants && product?.variants.length) {
      setSelectedVariant(product?.variants[0]);
    }
  }, [product?.variants]);

  const onVariantPress = (variant: CatalogProductVariant | null) => {
    setSelectedVariant(variant);
  };

  const onAddToCartPress = async () => {
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

  const onRefresh = async () => {
    setIsReFetching(true);
    await refetch();
    setIsReFetching(false);
  };

  if (isLoading) {
    return <ProductDetailPlaceholder />;
  }
  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={t('menu')}
        renderLeft={() => {
          return (
            <Icon
              name="arrow-left"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        renderRight={() => {
          return (
            <Icon
              name="shopping-cart"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        onPressRight={onAddToCartPress}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <FlatList
        refreshControl={
          <RefreshControl
            title="Pull to refresh"
            colors={[colors.primary]}
            tintColor={colors.primary}
            titleColor={colors.text}
            refreshing={isReFetching}
            onRefresh={onRefresh}
          />
        }
        style={styles.container}
        data={[1]}
        renderItem={() => {
          return (
            <View>
              <Image
                source={
                  product?.primaryImage?.URLs?.medium
                    ? {
                        uri: product?.primaryImage?.URLs?.medium,
                      }
                    : Images.imagePlaceholder
                }
                style={styles.image}
              />
              <Text title1 heavy>
                {product?.title}
              </Text>
              <Text caption1>{product?.description}</Text>
              <Text headline style={{ marginTop: 10 }}>
                Select Size:
              </Text>
              <View style={[styles.variantsContainer]}>
                {product?.variants?.map((variant) => (
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
                  onPressAdd={() =>
                    setQuantity((oldQuantity) => oldQuantity + 1)
                  }
                  onPressRemove={() =>
                    setQuantity((oldQuantity) =>
                      oldQuantity !== 1 ? oldQuantity - 1 : oldQuantity,
                    )
                  }
                  quantity={quantity}
                />
              </View>
            </View>
          );
        }}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}>
        <EcommerceButton
          leftText="Rs.0"
          title="Add to cart"
          rightText={'0'}
          onPress={onAddToCartPress}
          onCartCountPress={onAddToCartPress}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
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
