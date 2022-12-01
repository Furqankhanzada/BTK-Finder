import React, { useState } from 'react';
import { FlatList, SafeAreaView, TouchableOpacity, View } from 'react-native';

import { Header, Text, TextInput, Button, Icon } from '@components';
import { BaseColor, BaseStyle, useTheme } from '@config';
import { StackScreenProps } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { useBusiness } from '@screens/businesses/queries/queries';

import useAddBusinessStore from '../store/Store';
import { useCategories } from '../../category/queries/queries';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';
import { NewAddBusinessPresentable } from '../models/AddNewBusinessPresentable';

export const CategoryScreen = ({
  navigation,
  route,
}: StackScreenProps<GlobalParamList>) => {
  const { data: categories, refetch } = useCategories(['select-category']);
  // const { data: businessData } = useBusiness(route?.params?.id);

  const setCategory = useAddBusinessStore((state: any) => state.setCategory);
  const isEditBusiness = useAddBusinessStore(
    (state: any) => state.isEditBusiness,
  );

  const { colors } = useTheme();
  const { t } = useTranslation();

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

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={isEditBusiness ? 'Update Category' : 'Select Category'}
        renderLeft={() => {
          return isEditBusiness ? (
            <Icon
              name="arrow-left"
              size={20}
              color="#5dade2"
              enableRTL={true}
            />
          ) : null;
        }}
        onPressLeft={() => {
          navigation.navigate('EditBusiness');
        }}
      />
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

        <View
          style={
            isEditBusiness ? styles.stickyFooterEdit : styles.stickyFooter
          }>
          {isEditBusiness ? null : (
            <Button style={styles.footerButtons} onPress={navigateToBack}>
              {'Back'}
            </Button>
          )}

          <Button
            style={[
              styles.footerButtons,
              !active ? { backgroundColor: BaseColor.grayColor } : null,
            ]}
            title="submit"
            onPress={() => navigateToNext()}>
            {isEditBusiness ? 'Update Category' : 'Next'}
          </Button>
        </View>
      </>
    </SafeAreaView>
  );
};
