import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';

import { Header, SafeAreaView, Icon, Text, Image } from '@components';
import { BaseStyle, useTheme } from '@config';

import { ProductStackParamList } from '../../../navigation/models/BusinessDetailBottomTabParamList';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import * as Utils from '@utils';
import emptyCartImage from '@assets/images/empty-cart.png';

export default function CartScreen(
  props: StackScreenProps<ProductStackParamList, 'Cart'>,
) {
  const { navigation } = props;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const empty = true;

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
      {empty ? (
        <View style={styles.container}>
          <Image
            source={emptyCartImage}
            style={styles.emptyCartImage}
            resizeMode="contain"
          />
          <Text title3 bold style={styles.emptyCartTitle}>
            Your Cart Is Empty!
          </Text>
          <Text body2>Add Items in your cart to view.</Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
});
