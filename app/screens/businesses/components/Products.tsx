import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  StyleProp,
  ViewStyle,
  RefreshControl,
  Text,
} from 'react-native';

import { CardList, Icon, Tag } from '@components';
import { useTheme } from '@config';
import { BusinessPresentable } from '@screens/businesses/models/BusinessPresentable';
import { useProductsByTag, useTags } from '@screens/businesses/queries/queries';

import useMemberStore from '../members/store/Store';
import { CatalogProduct, Tag as TagType } from '../../../models/graphql';
import MenuTabPlaceholder from './MenuTabPlaceholder';
import MenuItemsPlaceholder from './MenuItemsPlaceholder';

interface Props {
  onProductPress: (item: CatalogProduct) => void;
  business: BusinessPresentable | undefined;
  style?: StyleProp<ViewStyle>;
  selectionMode?: boolean;
}

export default function Products({
  onProductPress,
  business,
  style,
  selectionMode,
}: Props) {
  const { selectedPackage } = useMemberStore();
  const [selectedTag, setSelectedTag] = useState<TagType | undefined>();
  const [isReFetching, setIsReFetching] = useState<boolean>(false);
  const { colors } = useTheme();
  //Tags
  const {
    data: tags,
    refetch: reFetchTags,
    isLoading,
  } = useTags(business?.shop?.shopId);
  // Products
  const {
    refetch: reFetchProducts,
    data: products,
    isLoading: isProductsLoading,
  } = useProductsByTag(business?.shop?.shopId, selectedTag?._id);

  useEffect(() => {
    if (tags && tags.length) {
      setSelectedTag(tags[0]);
    }
  }, [tags]);

  const onTagPress = (tag: TagType) => {
    setSelectedTag(tag);
  };

  const onRefresh = async () => {
    setIsReFetching(true);
    await reFetchTags();
    await reFetchProducts();
    setIsReFetching(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        listKey="products"
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
        style={[styles.productsContainer]}
        data={products}
        keyExtractor={(item) => item._id}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={
          isLoading ? (
            <MenuTabPlaceholder />
          ) : (
            <FlatList
              contentContainerStyle={[styles.tagsContainer, style]}
              horizontal={true}
              data={tags}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <Tag
                  key={item._id}
                  rate
                  onPress={() => onTagPress(item)}
                  style={[
                    styles.item,
                    selectedTag?._id === item._id
                      ? {
                          backgroundColor: colors.primaryDark,
                        }
                      : { backgroundColor: colors.primary },
                  ]}>
                  {item.displayTitle}
                </Tag>
              )}
            />
          )
        }
        ListEmptyComponent={
          isProductsLoading && !products ? (
            <MenuItemsPlaceholder />
          ) : (
            <Text style={[styles.listEmptyText, { color: colors.text }]}>
              No Products
            </Text>
          )
        }
        renderItem={({ item }) => (
          <CardList
            key={item._id}
            image={item.primaryImage?.URLs?.thumbnail!}
            title={item.title}
            subtitle={item.pricing[0]?.displayPrice}
            style={[styles.productList, style]}
            onPress={() => onProductPress(item)}
            options={item.variants?.map((variant) => variant?.optionTitle)}
            iconRight={
              selectionMode && item._id === selectedPackage.id ? (
                <Icon name="check-circle" color={colors.primary} size={20} />
              ) : null
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tagsContainer: {
    marginBottom: 10,
  },
  productsContainer: {
    marginTop: 15,
  },
  productList: {
    marginTop: 10,
  },
  item: {
    marginRight: 5,
  },
  listEmptyText: {
    textAlign: 'center',
    paddingVertical: 20,
  },
});
