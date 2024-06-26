import React, { useState } from 'react';
import {
  FlatList,
  RefreshControl,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { Header, SafeAreaView, Icon, TextInput, Text } from '@components';
import * as Utils from '@utils';
import { BaseStyle, BaseColor, useTheme } from '@config';

import { useCategories } from './queries/queries';
import { MainStackParamList } from 'navigation/models/MainStackParamList';
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types';
import CategoryPlaceHolder from './components/CategoryPlaceholder';
import { CategoryPresentable } from './modals/CategoryPresentables';
import CategoryIcon from './components/CategoryIcon';
import CategoryFull from './components/CategoryFull';

export default function CategoryScreen(
  props: StackScreenProps<MainStackParamList, 'Category'>,
) {
  const queryClient = useQueryClient();
  const { navigation } = props;

  const { t } = useTranslation();
  const { colors } = useTheme();

  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [modeView, setModeView] = useState<string>('icon');
  const [filteredCategories, setFilteredCategories] =
    useState<CategoryPresentable[]>();

  const {
    isLoading,
    data: categories,
    refetch,
  } = useCategories(['categories']);

  const onChangeView = () => {
    Utils.enableExperimental();
    switch (modeView) {
      case 'full':
        setModeView('icon');
        break;
      case 'icon':
        setModeView('full');
        break;
    }
  };

  const onSearch = (text: string) => {
    setSearch(text);
    const cachedCategories: CategoryPresentable[] | undefined =
      queryClient.getQueryData(['categories']);
    const filterCacheCategory = cachedCategories?.filter(
      (category: CategoryPresentable) => {
        return category.name.toLowerCase().includes(text.toLowerCase());
      },
    );
    setFilteredCategories(filterCacheCategory);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderItem = (item: CategoryPresentable) => {
    switch (modeView) {
      case 'icon':
        return (
          <CategoryIcon
            icon={item.icon}
            title={item.name}
            onPress={() =>
              navigation.navigate('Businesses', {
                title: item.name,
                category: item.name,
              })
            }
            style={[styles.itemIcon, { borderColor: colors.border }]}
          />
        );
      case 'full':
        return (
          <CategoryFull
            image={item.image || 'https://i.ibb.co/VpvP0X5/empty-image.jpg'}
            icon={item.icon}
            title={item.name}
            onPress={() =>
              navigation.navigate('Businesses', {
                title: item.name,
                category: item.name,
              })
            }
            style={styles.itemFull}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={t('categories')}
        renderLeft={() => {
          return <Icon name="arrow-left" size={20} color={colors.primary} />;
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        renderRight={() => {
          return (
            <Icon
              name={modeView === 'full' ? 'th-large' : 'th-list'}
              size={20}
              color={BaseColor.grayColor}
            />
          );
        }}
        onPressRight={onChangeView}
      />
      <View style={styles.viewContainer}>
        <TextInput
          onChangeText={onSearch}
          placeholder={t('search')}
          value={search}
          icon={
            <TouchableOpacity
              onPress={() => {
                onSearch('');
              }}>
              <Icon name="times" size={16} color={BaseColor.grayColor} />
            </TouchableOpacity>
          }
        />
      </View>
      {isLoading ? (
        <View style={styles.placeHolderContainer}>
          <CategoryPlaceHolder />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.flatListContainer}
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          data={filteredCategories ? filteredCategories : categories}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => renderItem(item)}
          ListEmptyComponent={
            <View style={styles.viewSubContainer}>
              <Text body2 style={styles.subConatinerText}>
                {t('data_not_found')}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  itemFull: {
    marginBottom: 15,
    backgroundColor: '#e1e4e8',
  },
  itemIcon: {
    marginBottom: 10,
    borderBottomWidth: 0.5,
    paddingBottom: 10,
  },
  viewContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  viewSubContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subConatinerText: {
    textAlign: 'center',
  },
  placeHolderContainer: {
    paddingHorizontal: 20,
  },
  flatListContainer: {
    paddingHorizontal: 20,
  },
});
