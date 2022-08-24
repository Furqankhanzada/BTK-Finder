import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  StyleProp,
  ViewStyle,
  RefreshControl,
} from 'react-native';

import { BusinessPresentable } from '@screens/businesses/models/BusinessPresentable';
import { CardList, Tag } from '@components';
import { useProductsByTag, useTags } from '@screens/businesses/queries/queries';
import { useTheme } from '@config';

import { Tag as TagType } from '../../../models/graphql';

interface Props {
  business: BusinessPresentable | undefined;
  style?: StyleProp<ViewStyle>;
}

export default function Products({ business, style }: Props) {
  const [selectedTag, setSelectedTag] = useState<TagType | undefined>();
  const [isReFetching, setIsReFetching] = useState<boolean>(false);
  const { colors } = useTheme();

  const { data: tags, refetch: reFetchTags } = useTags(business?.shop?.shopId);
  const { refetch: reFetchProducts, data: products } = useProductsByTag(
    business?.shop?.shopId,
    selectedTag?._id,
  );

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
        }
        renderItem={({ item }) => (
          <CardList
            key={item._id}
            image={item.primaryImage?.URLs?.thumbnail!}
            title={item.title}
            subtitle={item.pricing[0]?.displayPrice}
            style={[styles.productList, style]}
            options={item.variants?.map((variant) => variant?.optionTitle)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
