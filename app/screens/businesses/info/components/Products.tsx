import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, View } from 'react-native';

import { BusinessPresentable } from '@screens/businesses/models/BusinessPresentable';
import { CardList, Tag } from '@components';
import { useProductsByTag, useTags } from '@screens/businesses/queries/queries';
import { Tag as TagType } from '../../../../models/graphql';
import { useTheme } from '@config';

interface Props {
  business: BusinessPresentable;
}

export default function Products({ business }: Props) {
  const [selectedTag, setSelectedTag] = useState<TagType | undefined>();
  const { colors } = useTheme();

  const { data: tags } = useTags(business.shop?.shopId);
  const { data: products } = useProductsByTag(
    business.shop?.shopId,
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
  return (
    <View>
      <FlatList
        contentContainerStyle={styles.tagsContainer}
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
      <FlatList
        style={styles.productsContainer}
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <CardList
            key={item._id}
            image={item.primaryImage?.URLs?.thumbnail!}
            title={item.title}
            subtitle={item.pricing[0]?.displayPrice}
            style={styles.productList}
            options={item.variants?.map((variant) => variant?.optionTitle)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tagsContainer: {
    marginTop: 10,
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
