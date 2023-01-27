import React, { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';

import { useRemoteConfig } from '@hooks';
import { Header, Text, TextInput, Button, Icon } from '@components';
import { BaseStyle, useTheme } from '@config';
import { useBusiness } from '@screens/businesses/queries/queries';

import { styles } from '../styles/styles';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { useEditBusiness } from '../queries/mutations';
import useAddBusinessStore, {
  BusinessStoreActions,
  BusinessStoreTypes,
} from '../store/Store';

export const TagsScreen = (props: StackScreenProps<GlobalParamList>) => {
  const { navigation, route } = props;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const remoteConfig = useRemoteConfig();
  const isEditBusiness = route?.params?.id;

  const { mutate: editTags } = useEditBusiness(route?.params?.id);
  const { data: businessData } = useBusiness(route?.params?.id);

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
      navigation.navigate('EditBusiness', { id: businessData?._id });
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
        renderRight={() => {
          return isEditBusiness ? null : <Text>Skip</Text>;
        }}
        onPressRight={() => navigation.navigate('Telephone')}
      />

      <KeyboardAvoidingView
        behavior={Platform.select({ android: undefined, ios: 'padding' })}
        keyboardVerticalOffset={offsetKeyboard}
        style={styles.keyboardAvoidView}>
        <View style={styles.contain}>
          {tags ? (
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
            contentContainerStyle={styles.flatlistConatiner}
            data={tags}
            keyExtractor={(item, index) => {
              return `${index}-${item.name}`;
            }}
            renderItem={({ item, index }) => {
              const checked = selected.includes(item.name);
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.item, { backgroundColor: colors.card }]}
                  onPress={() => onChange(item)}>
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
            style={styles.footerButtons}
            title="submit"
            onPress={() => navigateToNext()}>
            {isEditBusiness ? 'Update Tags' : 'Next'}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
