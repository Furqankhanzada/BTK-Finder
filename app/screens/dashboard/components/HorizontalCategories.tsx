import React from 'react';
import { StyleSheet, FlatList, View, TouchableOpacity } from 'react-native';
import { Icon, Text } from '@components';
import { BaseColor } from '@config';
import { useCategories } from '@screens/category/queries/queries';
import { CategoryPresentable } from '@screens/category/modals/CategoryPresentables';
import { useTranslation } from 'react-i18next';
import { HorizontalCategoriesPlaceholder } from './DashboardPlaceholders';

interface Props {
  onPress: (item: CategoryPresentable) => void;
}

export default function HorizontalCategories({ onPress }: Props) {
  const { t } = useTranslation();
  const { data: categories, isLoading } = useCategories(['categories']);

  return !isLoading ? (
    <HorizontalCategoriesPlaceholder />
  ) : (
    <FlatList
      contentContainerStyle={styles.contentContainerStyle}
      data={categories}
      horizontal={true}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => {
        return (
          <TouchableOpacity
            style={styles.serviceItem}
            onPress={() => onPress(item)}>
            <View
              style={[
                styles.serviceCircleIcon,
                { backgroundColor: item.color },
              ]}>
              <Icon
                name={item.icon}
                size={20}
                color={BaseColor.whiteColor}
                solid
              />
            </View>
            <Text
              footnote
              textAlign="center"
              numberOfLines={1}
              style={styles.textStyle}>
              {t(item.name)}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingLeft: 0,
  },
  textStyle: { width: 80, height: 13 },
  serviceItem: {
    flex: 1,
    alignItems: 'center',
  },
  serviceCircleIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    marginBottom: 5,
  },
});
