import React, { useState } from 'react';
import {
  SectionList,
  FlatList,
  View,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Modal from 'react-native-modal';
import { useQuery } from '@apollo/client';

import { Header, SafeAreaView, Icon, Text, Image } from '@components';
import { BaseStyle, useTheme, Images, BaseColor } from '@config';

import Product from './components/Product';
import { GET_PRODUCTS } from '../../../requests/shop/menu';
import {
  CatalogItemConnection,
  CatalogItemProduct,
  CatalogItemSortByField,
  CatalogProduct,
  Maybe,
  QueryCatalogItemsArgs,
  SortOrder,
  Tag,
} from '../../../models/graphql';

type CatalogItems = {
  catalogItems: Maybe<CatalogItemConnection>;
};

type CatalogItemPresentable = {
  tag: Tag;
  data: Array<CatalogProduct>;
};

export default function Menu(props: any) {
  const { navigation, route } = props;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CatalogProduct>();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, loading, refetch } = useQuery<
    CatalogItems,
    QueryCatalogItemsArgs
  >(GET_PRODUCTS, {
    variables: {
      shopIds: [route.params.shop.shopId],
      sortBy: CatalogItemSortByField.UpdatedAt,
      sortOrder: SortOrder.Asc,
      first: 20,
    },
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

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const Item = ({ item }: { item: CatalogProduct }) => {
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
      {loading ? (
        <ActivityIndicator size={'large'} style={styles.activity} />
      ) : (
        <SectionList
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={true}
          sections={catalogItems}
          keyExtractor={(item: CatalogProduct) => item._id}
          renderSectionHeader={({ section }) => (
            <View style={styles.displayTitle}>
              {/* Here colors.text came from color? */}
              <Text style={[styles.title, { color: colors.text }]}>
                {section.tag.displayTitle}
              </Text>
              <FlatList
                style={styles.flatList}
                horizontal
                data={section.data}
                renderItem={({ item }) => <Item item={item} />}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )}
          renderItem={() => {
            return null;
          }}
        />
      )}
      <Modal
        isVisible={modalVisible}
        onSwipeComplete={() => {
          setModalVisible(false);
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
            <Text callout bold primaryColor style={styles.priceText}>
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

const styles = StyleSheet.create({
  sectionHeader: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  lineSwipeDown: {
    width: 30,
    height: 2.5,
    backgroundColor: BaseColor.dividerColor,
  },
  contentSwipeDown: {
    paddingTop: 10,
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 11,
  },
  modalImage: {
    height: 300,
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  contentPadding: {
    paddingHorizontal: 20,
  },
  modalTitle: {
    paddingTop: 10,
  },
  modalDescription: {
    paddingVertical: 10,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  contentFilterBottom: {
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingHorizontal: 0,
  },
  extraItemsSection: {
    paddingBottom: 10,
  },
  extraItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  flatList: {
    paddingLeft: 20,
  },
  displayTitle: {
    paddingBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingBottom: 10,
    paddingLeft: 20,
  },
  activity: {
    flex: 1,
  },
  priceText: {
    paddingBottom: 10,
  },
});
