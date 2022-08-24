import React from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Header, SafeAreaView, Icon } from '@components';
import { BaseStyle, useTheme } from '@config';

import Products from '@screens/businesses/components/Products';
import { useBusiness } from '@screens/businesses/queries/queries';

export default function BusinessProductsScreen(props: any) {
  const { navigation, route } = props;
  const { data: business } = useBusiness(route?.params?.id);

  const { colors } = useTheme();
  const { t } = useTranslation();

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
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <Products
        business={business}
        style={[styles.products, { backgroundColor: colors.background }]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  products: {
    paddingLeft: 20,
    paddingBottom: 10,
  },
});
