import React, { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { useBusiness } from '@screens/businesses/queries/queries';
import { Header, TextInput, Icon } from '@components';
import { BaseStyle, useTheme } from '@config';

import { NewBusinessParamList } from 'navigation/models/NewBusinessParamList';
import { useEditBusiness } from '../apis/mutations';
import { useCategories } from '../../category/queries/queries';
import useAddBusinessStore, {
  BusinessStoreActions,
  BusinessStoreTypes,
} from '../store/Store';
import { NavigationButtons } from '../components/NavigationButtons';
import { SelectItem } from '../components/SelectItem';

export const CategorySelectScreen = (
  props: StackScreenProps<NewBusinessParamList, 'CategorySelect'>,
) => {
  const { navigation, route } = props;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const isEditBusiness = route?.params?.businessId;

  const { data: categories } = useCategories(['categories']);
  const { data: businessData } = useBusiness(route?.params?.businessId ?? '');
  const { mutate: editBusiness } = useEditBusiness(
    route?.params?.businessId ?? '',
  );

  const category = useAddBusinessStore(
    (state: BusinessStoreTypes) => state.category,
  );
  const setCategory = useAddBusinessStore(
    (state: BusinessStoreActions) => state.setCategory,
  );

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
      navigation.goBack();
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
        behavior={Platform.select({ android: undefined, ios: 'padding' })}
        keyboardVerticalOffset={offsetKeyboard}
        style={styles.keyboardAvoidView}>
        <FlatList
          contentContainerStyle={styles.container}
          data={items}
          keyExtractor={(item, index) => {
            return `${index}-${item.name}`;
          }}
          ListHeaderComponent={() => {
            return categories ? (
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
            ) : null;
          }}
          renderItem={({ item, index }) => {
            const checked = selectedCategory === item.name;
            return (
              <SelectItem
                key={`${index + item._id}`}
                onPress={() => onChange(item)}
                text={item.name}
                checked={checked}
                icon={item.icon}
              />
            );
          }}
        />

        <NavigationButtons
          onSubmit={navigateToNext}
          disabled={!category}
          isEdit={!!isEditBusiness}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidView: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    flex: 1,
    marginTop: 10,
  },
});