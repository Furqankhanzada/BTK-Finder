import React, { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

import { useBusiness } from '@screens/businesses/queries/queries';
import { Header, TextInput, Icon, Text } from '@components';
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
import ArrowBack from '../components/ArrowBack';

export default function CategorySelectScreen(
  props: StackScreenProps<NewBusinessParamList, 'CategorySelect'>,
) {
  const { navigation, route } = props;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const isEditBusiness = route.params?.businessId;

  const { data: categories } = useCategories(['categories']);
  const { data: businessData } = useBusiness(route.params?.businessId);
  const { mutate: editBusiness, isLoading } = useEditBusiness();

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
    if (isEditBusiness && businessData?.category) {
      setSelectedCategory(businessData.category);
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

  const onSubmit = () => {
    if (isEditBusiness) {
      editBusiness(
        {
          businessId: route.params.businessId,
          data: { category: selectedCategory },
        },
        {
          onSuccess() {
            navigation.goBack();
          },
        },
      );
    } else if (selectedCategory) {
      navigation.navigate('Facilities');
    }
  };

  const navigateToBack = () => {
    if (isEditBusiness) {
      navigation.goBack();
    }
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={isEditBusiness ? 'Update Category' : 'Select Category'}
        renderLeft={() => <ArrowBack show={!!isEditBusiness} />}
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
          ListHeaderComponent={() => (
            <View>
              <Text title1 bold>
                Select a category for your business
              </Text>
              {categories ? (
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => onSearch(text)}
                  placeholder={t('search')}
                  value={search}
                  icon={
                    <TouchableOpacity onPress={() => onSearch('')}>
                      <Icon
                        name="times"
                        size={16}
                        color={colors.primaryLight}
                      />
                    </TouchableOpacity>
                  }
                />
              ) : null}
            </View>
          )}
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
          onSubmit={onSubmit}
          loading={isLoading}
          disabled={!category || isLoading}
          isEdit={!!isEditBusiness}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidView: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    marginTop: 10,
    paddingBottom: 50,
  },
  input: {
    marginTop: 15,
  },
});
