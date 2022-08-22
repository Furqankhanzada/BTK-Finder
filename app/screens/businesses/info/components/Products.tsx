import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';

import { BusinessPresentable } from '@screens/businesses/models/BusinessPresentable';
import { Tag } from '@components';
import { useTags } from '@screens/businesses/queries/queries';
import { Tag as TagType } from '../../../../models/graphql';
import { useTheme } from '@config';

interface Props {
  business: BusinessPresentable;
}

export default function Products({ business }: Props) {
  const [selectedTag, setSelectedTag] = useState<TagType | undefined>();
  const { colors } = useTheme();

  const { data: tags } = useTags(business.shop?.shopId);

  useEffect(() => {
    if (tags && tags.length) {
      setSelectedTag(tags[0]);
    }
  }, [tags]);

  const onTagPress = (tag: TagType) => {
    setSelectedTag(tag);
  };
  return (
    <FlatList
      contentContainerStyle={styles.container}
      horizontal={true}
      data={tags}
      renderItem={({ item }) => (
        <Tag
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
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  item: {
    marginRight: 5,
  },
});
