import React, { useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Formik } from 'formik';
import { useQueryClient } from '@tanstack/react-query';

import {
  Header,
  Text,
  TextInput,
  Button,
  Icon,
  ListThumbCircle,
} from '@components';
import { BaseColor, BaseStyle, useTheme } from '@config';

import { useCategories } from '../../category/queries/queries';
import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { ScrollView } from 'react-native-gesture-handler';
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

  console.log('new business categpries :', categries);
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
                onPress={
                  () => {
                    {
                      // console.log('OnPress :', item._id);
                      setActive(true);
                    }
                  }

                  // navigation.navigate('', {
                  //   title: item.name,
                  //   category: item.name,
                  //   categoryIcon: item.icon,
                  //   // route: item.route,
                  //   // latitude: route?.params?. latitude ?? null,
                  //   // longitude: route?.params?.longitude ?? null,
                  // })
                }
                style={
                  active
                    ? [styles.itemIcon, { borderColor: colors.border }]
                    : [styles.itemIcon, { borderColor: 'blue' }]
                }
              />
            );
            // return (
            //   <Text
            //     style={[
            //       styles.renderItemList,
            //       { borderBottomColor: colors.primary },
            //     ]}>
            //     {item.name}
            //   </Text>
            // );
          }}
          ListEmptyComponent={
            <View>
              <Text body2>{'data_not_found'}</Text>
            </View>
          }></FlatList>
        <View style={styles.stickyFooter}>
          <Button onPress={() => navigateToBack()}>{'Back'}</Button>
          <Button onPress={() => navigateToNext()}>{'Next'}</Button>
        </View>
      </>
      {/* );
        }}
      </Formik> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    paddingVertical: 20,
  },
  input: {
    marginTop: 15,
  },
  stickyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  renderItemList: {
    fontSize: 18,
    lineHeight: 45,
    borderBottomWidth: 2,
  },
  viewContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  itemIcon: {
    marginBottom: 10,
    borderBottomWidth: 0.5,
    paddingBottom: 10,
  },
  activeItem: {
    marginBottom: 10,
    borderBottomWidth: 0.5,
    paddingBottom: 10,
    borderBottomColor: 'blue',
  },
});
