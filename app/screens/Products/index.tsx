import React, { useState } from 'react';
import { SectionList, FlatList, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Modal from 'react-native-modal';
import { useQuery } from '@apollo/client';

import { Header, SafeAreaView, Icon, Text, Image } from '@components';
import { BaseStyle, useTheme, Images } from '@config';

import Product from './components/Product';
import styles from './styles';
import { GET_PRODUCTS } from '../../requests/shop/menu';
import {
  CatalogItemConnection,
  CatalogItemProduct,
  CatalogProduct,
  Maybe,
  QueryCatalogItemsArgs,
  Tag,
} from '../../models/graphql';

type CatalogItems = {
  catalogItems: Maybe<CatalogItemConnection>;
};

type CatalogItemPresentable = {
  tag: Tag;
  data: Array<CatalogProduct>;
};

export default function Menu(props: any) {
  const { navigation } = props;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CatalogProduct>();

  const { data, loading, error } = useQuery<
    CatalogItems,
    QueryCatalogItemsArgs
  >(GET_PRODUCTS, {
    variables: {
      shopIds: ['cmVhY3Rpb24vc2hvcDpGN2ZrM3plR3o4anpXaWZzQQ=='],
      first: 20,
    },
    // fetchPolicy: 'network-only',
  });

  const catalogItems: Array<CatalogItemPresentable> = [];

  data?.catalogItems?.edges?.map((catalog) => {
    const catalogItem = catalog?.node as CatalogItemProduct;
    catalogItem.product?.tags?.nodes?.map((tag) => {
      if (tag && !catalogItems.find((ci: any) => ci.tag._id === tag?._id)) {
        catalogItems.push({
          tag: tag,
          data: [catalogItem.product],
        } as CatalogItemPresentable);
      } else {
        catalogItems
          .find((ci: any) => ci.tag._id === tag?._id)
          ?.data.push(catalogItem.product as CatalogProduct);
      }
    });
    return catalog;
  });

  const onItemClick = (item: any) => {
    setModalVisible(true);
    setSelectedItem(item);
  };

  const Item = ({ item, index }: { item: CatalogProduct; index: number }) => {
    return (
      <Product
        name={item.title || ''}
        description={item.description || ''}
        price={item.pricing.map((p) => p?.displayPrice).join('')}
        image={item.primaryImage?.URLs?.thumbnail}
        onPress={() => onItemClick(item)}
      />
    );
  };

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
      <SectionList
        style={styles.menuContent}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={true}
        sections={catalogItems}
        keyExtractor={(item: any) => item.id}
        renderSectionHeader={({ section }) => (
          <View style={{ paddingBottom: 10 }}>
            <Text
              style={{
                color: colors.text,
                fontWeight: 'bold',
                fontSize: 16,
                paddingBottom: 10,
                paddingLeft: 20,
              }}>
              {section.tag.displayTitle}
            </Text>
            <FlatList
              style={{ paddingLeft: 20 }}
              horizontal
              data={section.data}
              renderItem={({ item, index }) => (
                <Item item={item} index={index} />
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
        renderItem={() => {
          return null;
          // return <ListItem item={item} />;
        }}
      />
      <Modal
        isVisible={modalVisible}
        onSwipeComplete={() => {
          setModalVisible(false);
          // setSortOption(props.sortOption);
        }}
        swipeDirection={['down']}
        style={styles.bottomModal}>
        <View
          style={[
            styles.contentFilterBottom,
            { backgroundColor: colors.card },
          ]}>
          <Image
            source={
              selectedItem?.primaryImage?.URLs?.large ?? Images.imagePlaceholder
            }
            style={[styles.modalImage, { backgroundColor: colors.card }]}
          />
          <View style={[styles.contentSwipeDown]}>
            <View style={styles.lineSwipeDown} />
          </View>
          <View style={styles.contentPadding}>
            <Text semibold title1 style={styles.modalTitle}>
              {selectedItem?.title}
            </Text>
            {selectedItem?.description ? (
              <Text body2 style={styles.modalDescription}>
                {selectedItem.description}
              </Text>
            ) : null}
            <Text callout bold primaryColor style={{ paddingBottom: 10 }}>
              {selectedItem?.pricing.map((p) => p?.displayPrice).join('')}
            </Text>
            <View style={styles.extraItemsSection}>
              {selectedItem?.variants?.length &&
                selectedItem.variants.map((variant) => {
                  return (
                    <View
                      style={[
                        styles.extraItems,
                        { borderColor: colors.border },
                      ]}>
                      <Text body2>{variant?.title}</Text>
                      <Text body2>
                        {variant?.pricing.map((p) => p?.displayPrice).join('')}
                      </Text>
                    </View>
                  );
                })}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
