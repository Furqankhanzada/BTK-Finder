import React, { useState } from 'react';
import {
  FlatList,
  RefreshControl,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { BaseStyle, BaseColor, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  CategoryFull,
  CategoryIcon,
  TextInput,
  Text,
} from '@components';
import * as Utils from '@utils';

import { fetchBusinessCatagory } from './queries/queries';
import { GlobalParamList } from 'navigation/models/GlobalParamList';
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types';
import CategoryPlaceHolder from './components/categoryPlaceholder';

export default function CategoryScreen(
  props: StackScreenProps<GlobalParamList, 'Category'>,
) {
  const { navigation, route } = props;

  const { t } = useTranslation();
  const { colors } = useTheme();

  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [modeView, setModeView] = useState('icon');
  const [filterCategories, setFilterCategories] = useState();

  const {
    isLoading,
    data: catagory,
    refetch,
  } = useQuery(['business-catagories'], fetchBusinessCatagory);

  if (isLoading) {
    return (
      <View style={styles.placeHolderContainer}>
        <Header title={t('categories')} />
        <CategoryPlaceHolder />
      </View>
    );
  }

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

  const queryClient = useQueryClient();

  const onSearch = (text: any) => {
    setSearch(text);
    const getCacheCategories: any = queryClient.getQueryData([
      'business-catagories',
    ]);

    const filterCacheCatagory = getCacheCategories.data.filter(
      (catagory: any) => {
        return catagory.name.includes(text);
      },
    );
    setFilterCategories(filterCacheCatagory);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderItem = (item: any) => {
    switch (modeView) {
      case 'icon':
        return (
          <CategoryIcon
            icon={item.icon}
            title={item.name}
            onPress={() =>
              navigation.navigate('Place', {
                title: item.name,
                category: item.name,
                categoryIcon: item.icon,
                route: item.route,
                latitude: route?.params?.latitude ?? null,
                longitude: route?.params?.longitude ?? null,
              })
            }
            style={[styles.itemIcon, { borderColor: colors.border }]}
          />
        );
      case 'full':
        return (
          <CategoryFull
            image={{
              uri: item.image || 'https://i.ibb.co/VpvP0X5/empty-image.jpg',
            }}
            icon={item.icon}
            title={item.name}
            onPress={() =>
              navigation.navigate('Place', {
                title: item.name,
                category: item.name,
                route: item.route,
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
                setSearch('');
                onSearch;
              }}>
              <Icon name="times" size={16} color={BaseColor.grayColor} />
            </TouchableOpacity>
          }
        />
      </View>

      <FlatList
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        data={filterCategories ? filterCategories : catagory?.data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderItem(item)}
        ListEmptyComponent={
          <View style={styles.viewSubContainer}>
            <Text body2 style={styles.subConatinerText}>
              {t('data_not_found')}
            </Text>
          </View>
        }
      />
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
});
