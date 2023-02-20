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

import { useRemoteConfig } from '@hooks';
import { Header, TextInput, Icon } from '@components';
import { BaseStyle, useTheme } from '@config';
import { useBusiness } from '@screens/businesses/queries/queries';

import { NewBusinessParamList } from 'navigation/models/NewBusinessParamList';
import { useEditBusiness } from '../apis/mutations';
import useAddBusinessStore, {
  BusinessStoreActions,
  BusinessStoreTypes,
} from '../store/Store';
import { NavigationButtons } from '../components/NavigationButtons';
import { SelectItem } from '../components/SelectItem';

export const TagsScreen = (
  props: StackScreenProps<NewBusinessParamList, 'Tags'>,
) => {
  const { navigation, route } = props;
  const { colors } = useTheme();
  const remoteConfig = useRemoteConfig();
  const isEditBusiness = route?.params?.businessId;

  const { data: businessData } = useBusiness(route?.params?.businessId ?? '');
  const { mutate: editTags } = useEditBusiness(route?.params?.businessId ?? '');

  const storeTags = useAddBusinessStore(
    (state: BusinessStoreTypes) => state.tags,
  );
  const setTag = useAddBusinessStore(
    (state: BusinessStoreActions) => state.setTags,
  );

  const tags = remoteConfig?.tags;
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState<string>('');
  const [items, setItems] = useState(tags);

  useEffect(() => {
    if (isEditBusiness && businessData?.tags) {
      setSelected(businessData?.tags);
    } else if (storeTags) {
      setSelected(storeTags);
    }
  }, [businessData?.tags, isEditBusiness, storeTags]);

  const onChange = (select: { name: string }) => {
    //Check if tag is selected or not
    const isItemSelected = selected.includes(select?.name);

    if (!isItemSelected) {
      //Add Tag into selected tags when not available
      const selectedTags = [...selected];
      selectedTags.push(select.name);
      setSelected(selectedTags);
    } else {
      //Remove Tag from selected tags if already available
      const updatedTags = selected.filter(
        (item: string) => item !== select.name,
      );
      setSelected(updatedTags);
    }
  };

  const onSearch = (keyword: string) => {
    setSearch(keyword);
    if (!keyword) {
      setItems(tags ?? []);
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
      editTags({ tags: selected });
      navigation.goBack();
    } else {
      setTag(selected);
      navigation.navigate('Telephone');
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
        title={isEditBusiness ? 'Edit Tags' : 'Select Tags'}
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
        {tags ? (
          <TextInput
            onChangeText={(text) => onSearch(text)}
            placeholder="Search"
            value={search}
            icon={
              <TouchableOpacity onPress={() => onSearch('')}>
                <Icon name="times" size={16} color={colors.primaryLight} />
              </TouchableOpacity>
            }
          />
        ) : null}
        <FlatList
          contentContainerStyle={styles.container}
          data={tags}
          keyExtractor={(item, index) => {
            return `${index}-${item.name}`;
          }}
          renderItem={({ item, index }) => {
            const checked = selected.includes(item.name);
            return (
              <SelectItem
                key={`${index + item.name}`}
                onPress={() => onChange(item)}
                text={item.name}
                checked={checked}
              />
            );
          }}
        />

        <NavigationButtons
          onSubmit={navigateToNext}
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
