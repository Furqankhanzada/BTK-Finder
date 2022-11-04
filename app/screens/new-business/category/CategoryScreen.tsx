import React, { useState } from 'react';
import { FlatList, SafeAreaView, TouchableOpacity, View } from 'react-native';

import { Header, Text, TextInput, Button, Icon } from '@components';
import { BaseStyle, useTheme } from '@config';
import useAddBusinessStore from '../store/Store';

import { useCategories } from '../../category/queries/queries';
import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';
import { useTranslation } from 'react-i18next';
import { NewAddBusinessPresentable } from '../models/AddNewBusinessPresentable';

export const CategoryScreen = ({
  navigation,
}: StackScreenProps<GlobalParamList>) => {
  const {
    isLoading,
    data: categories,
    refetch,
  } = useCategories(['select-category']);

  const setCategory = useAddBusinessStore((state: any) => state.setCategory);

  const { colors } = useTheme();
  const { t } = useTranslation();

  const [refresh, setRefres] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [active, setActive] = useState<boolean>(false);
  const [items, setItems] = useState(categories);
  const [selectedCategory, setSelectedCategory] = useState<
    Array<NewAddBusinessPresentable>
  >([]);

  const onChange = (select: NewAddBusinessPresentable) => {
    const isItemSelected = selectedCategory.some(
      (obj: NewAddBusinessPresentable) => obj.name === select.name,
      setActive(true),
    );

    if (!isItemSelected) {
      setSelectedCategory([...selectedCategory, select]);
      setCategory(select.name);
    } else {
      const arr = selectedCategory.filter(
        (item: NewAddBusinessPresentable) => item.name != select.name,
      );
      setSelectedCategory(arr);
      setCategory(arr[0].name);
    }
  };

  const onSearch = (keyword: string) => {
    setSearch(keyword);
    if (!keyword) {
      setItems(categories ?? []);
    } else {
      setItems(
        items?.filter((item: { name: string }) => {
          return item.name.toUpperCase().includes(search.toUpperCase());
        }),
      );
    }
  };

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

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header title="Select Category" />
      <>
        <View style={styles.contain}>
          {categories ? (
            <TextInput
              onChangeText={(text) => onSearch(text)}
              placeholder={t('search')}
              value={search}
              icon={
                <TouchableOpacity onPress={() => onSearch('')}>
                  <Icon name="times" size={16} color={colors.primaryLight} />
                </TouchableOpacity>
              }
            />
          ) : null}
          <FlatList
            contentContainerStyle={{ paddingVertical: 10 }}
            data={items}
            keyExtractor={(item: object, index: any) => {
              return index;
            }}
            renderItem={({ item, index }) => {
              const checked = selectedCategory.some(
                (obj: NewAddBusinessPresentable) => obj.name === item.name,
              );
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.item, { backgroundColor: colors.card }]}
                  onPress={() => onChange(item)}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon
                      name={item.icon}
                      color={item?.checked ? colors.primary : colors.text}
                      style={{ marginRight: 10 }}
                      size={15}
                    />
                    <Text
                      body1
                      style={
                        checked
                          ? {
                              color: colors.primary,
                            }
                          : {}
                      }>
                      {item.name}
                    </Text>
                  </View>
                  {checked && (
                    <Icon name="check" size={14} color={colors.primary} />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>

        <View style={styles.stickyFooter}>
          <Button style={styles.footerButtons} onPress={() => navigateToBack()}>
            {'Back'}
          </Button>
          {active === true ? (
            <Button
              style={styles.footerButtons}
              onPress={() => navigateToNext()}>
              {'Next'}
            </Button>
          ) : null}
        </View>
      </>
    </SafeAreaView>
  );
};
