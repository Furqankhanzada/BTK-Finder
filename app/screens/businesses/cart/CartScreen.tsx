import React from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';

import * as Utils from '@utils';
import { Header, SafeAreaView, Icon, Text, Image, Button } from '@components';
import { BaseStyle, Images, useTheme } from '@config';

import { ProductStackParamList } from '../../../navigation/models/BusinessDetailBottomTabParamList';
import CartItemCard from './components/CartItemCard';
import CartInfo from './components/CartInfo';
import { cartItems } from './cartData';

export default function CartScreen(
  props: StackScreenProps<ProductStackParamList, 'Cart'>,
) {
  const { navigation } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={t('my_cart')}
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
        onPressLeft={() => navigation.goBack()}
      />

      <FlatList
        listKey="CartItems"
        contentContainerStyle={styles.container}
        data={cartItems ? cartItems : []}
        keyExtractor={(item, index) => `${item._id}_item${index.toString()}`}
        ListEmptyComponent={
          <View style={styles.emptyCartContainer}>
            <Image
              source={Images.emptyCart}
              style={styles.emptyCartImage}
              resizeMode="contain"
            />
            <Text title3 bold style={styles.emptyCartTitle}>
              Your Cart Is Empty!
            </Text>
            <Text body2>Add Items in your cart to view.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <>
            <FlatList
              data={item?.items ? item?.items : []}
              keyExtractor={(subItem, index) =>
                `${subItem._id}_subItem${index.toString()}`
              }
              ListEmptyComponent={
                <Text body2 medium>
                  No Items Found!
                </Text>
              }
              ListHeaderComponent={() => (
                <TouchableOpacity onPress={() => {}}>
                  <CartItemCard
                    image={item.image}
                    title={item.title}
                    subTitle={item.category}
                    rating={item.rating}
                  />
                </TouchableOpacity>
              )}
              renderItem={({ item: subItem }) => (
                <CartItemCard
                  subItem
                  image={subItem.image}
                  title={subItem.title}
                  subTitle={subItem.price}
                />
              )}
            />
          </>
        )}
        ListFooterComponent={() => (
          <CartInfo subtotal="3,000" shipping="200" total="3,200" />
        )}
      />

      <View
        style={[
          styles.checkoutButtonContainer,
          { backgroundColor: colors.background },
        ]}>
        <Button onPress={() => {}}>Checkout</Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartImage: {
    width: '100%',
    height: Utils.scaleWithPixel(200),
    marginBottom: 20,
  },
  emptyCartTitle: {
    marginBottom: 10,
  },
  checkoutButtonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
