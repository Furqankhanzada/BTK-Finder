import React from 'react';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';

import { Header, SafeAreaView, Icon } from '@components';
import { BaseStyle, useTheme } from '@config';

import Products from '@screens/businesses/components/Products';
import { useBusiness } from '@screens/businesses/queries/queries';

import { BusinessDetailBottomTabParamList } from '../../../navigation/models/BusinessDetailBottomTabParamList';
import ProductAddToCart from './components/Product-Add-To-Cart';
import ProductAddRemove from './components/Product-Add-Remove';

export default function BusinessProductsScreen(
  props: StackScreenProps<BusinessDetailBottomTabParamList, 'Products'>,
) {
  const { navigation, route } = props;
  const { data: business } = useBusiness(route.params.id);

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
        style={{ backgroundColor: colors.background }}
      />
      <ProductAddRemove />
      <ProductAddToCart />
    </SafeAreaView>
  );
}
