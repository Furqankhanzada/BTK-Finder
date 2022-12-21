import React, { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { useBusiness } from '@screens/businesses/queries/queries';
import { Header, Text, TextInput, Button, Icon } from '@components';
import { BaseColor, BaseStyle, useTheme } from '@config';

import { styles } from '../styles/styles';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { useEditBusiness } from '../queries/mutations';
import { useCategories } from '../../category/queries/queries';
import useAddBusinessStore from '../store/Store';

export const CategoryScreen = (props: StackScreenProps<GlobalParamList>) => {
  const { navigation, route } = props;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const isEditBusiness = route?.params?.id;

  const { data: categories } = useCategories(['categories']);
  const { data: businessData } = useBusiness(route?.params?.id);
  const { mutate: editBusiness } = useEditBusiness(route?.params?.id);

  const category = useAddBusinessStore((state: any) => state.category);
  const setCategory = useAddBusinessStore((state: any) => state.setCategory);

  const [selectedCategory, setSelectedCategory] = useState<string>(
    category ?? '',
  );
  const [search, setSearch] = useState<string>('');
  const [items, setItems] = useState(categories);

  useEffect(() => {
    if (isEditBusiness) {
      setSelectedCategory(businessData?.category ?? '');
    }
  }, [businessData?.category, isEditBusiness]);

  const onChange = (select: { name: string }) => {
    // Set State
    setSelectedCategory(select?.name);

    // Set in store
    setCategory(select?.name);
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
    if (isEditBusiness) {
      editBusiness({ category: selectedCategory });
      navigation.navigate('EditBusiness', { id: businessData?._id });
    } else if (selectedCategory) {
      navigation.navigate('Facilities');
    }
  };

  const navigateToBack = () => {
    navigation.goBack();
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

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
        onPressLeft={navigateToBack}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{ flex: 1 }}>
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
              const checked = selectedCategory === item.name;
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
              !selectedCategory
                ? { backgroundColor: BaseColor.grayColor }
                : null,
            ]}
            title="submit"
            onPress={() => navigateToNext()}>
            {isEditBusiness ? 'Update Category' : 'Next'}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
