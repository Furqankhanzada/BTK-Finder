import React, { useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import { Header, Text, TextInput, Button, Icon } from '@components';
import { BaseColor, BaseStyle, useTheme } from '@config';

import { useCategories } from '../../category/queries/queries';
import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';
import { CategoryPresentable } from '@screens/category/modals/CategoryPresentables';
import CategoryIcon from '@screens/category/components/CategoryIcon';

export const CategoryScreen = ({
  navigation,
}: StackScreenProps<GlobalParamList>) => {
  const { colors } = useTheme();
  const queryClient = useQueryClient();

  const [refresh, setRefres] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [filteredCategories, setFilteredCategories] =
    useState<CategoryPresentable[]>();
  const [active, setActive] = useState<boolean>(false);

  const {
    isLoading,
    data: categries,
    refetch,
  } = useCategories(['select-category']);

  const navigateToNext = () => {
    navigation.navigate('Facilities');
  };

  const navigateToBack = () => {
    navigation.goBack();
  };

  const onRefresh = async () => {
    setRefres(true);
    await refetch();
    setRefres(false);
  };

  const onSearch = (text: string) => {
    setSearch(text);
    const cachedCategories: CategoryPresentable[] | undefined =
      queryClient.getQueryData(['select-category']);
    const filterCacheCatagory = cachedCategories?.filter(
      (category: CategoryPresentable) => {
        return category.name.toLowerCase().includes(text.toLowerCase());
      },
    );
    setFilteredCategories(filterCacheCatagory);
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header title="Select Category" />
      <View style={styles.viewContainer}>
        <TextInput
          onChangeText={onSearch}
          placeholder={'Search category'}
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
      <>
        <FlatList
          style={styles.container}
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refresh}
              onRefresh={onRefresh}
            />
          }
          data={filteredCategories ? filteredCategories : categries}
          renderItem={({ item }) => {
            return (
              <CategoryIcon
                icon={item.icon}
                title={item.name}
                onPress={() => {
                  {
                    setActive(true);
                  }
                }}
                style={styles.itemIcon}
              />
            );
          }}
          ListEmptyComponent={
            <View>
              <Text body2>{'data_not_found'}</Text>
            </View>
          }></FlatList>
        <View style={styles.stickyFooter}>
          <Button onPress={() => navigateToBack()}>{'Back'}</Button>
          {active === true ? (
            <Button onPress={() => navigateToNext()}>{'Next'}</Button>
          ) : null}
        </View>
      </>
    </SafeAreaView>
  );
};
