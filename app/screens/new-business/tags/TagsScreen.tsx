import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';

import { useRemoteConfig } from '@hooks';
import { Header, TextInput, Icon, Text } from '@components';
import { BaseStyle, useTheme } from '@config';
import { useBusiness } from '@screens/businesses/queries/queries';

import { Tag } from 'models/RemoteConfig';
import { NewBusinessParamList } from 'navigation/models/NewBusinessParamList';
import { useEditBusiness } from '../apis/mutations';
import useAddBusinessStore, {
  BusinessStoreActions,
  BusinessStoreTypes,
} from '../store/Store';
import { NavigationButtons } from '../components/NavigationButtons';
import { SelectItem } from '../components/SelectItem';
import ArrowBack from '../components/ArrowBack';

export default function TagsScreen(
  props: StackScreenProps<NewBusinessParamList, 'Tags'>,
) {
  const { navigation, route } = props;
  const { colors } = useTheme();
  const remoteConfig = useRemoteConfig();
  const isEditBusiness = route.params?.businessId;

  const { data: businessData } = useBusiness(route.params?.businessId);
  const { mutate: editTags, isLoading } = useEditBusiness();

  const storeTags = useAddBusinessStore(
    (state: BusinessStoreTypes) => state.tags,
  );
  const setTags = useAddBusinessStore(
    (state: BusinessStoreActions) => state.setTags,
  );

  const tags = remoteConfig.tags;
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState<string>('');
  const [items, setItems] = useState<Tag[] | undefined>(tags);

  useEffect(() => {
    setItems(tags);
  }, [tags]);

  useEffect(() => {
    if (isEditBusiness) {
      const unsubscribe = navigation.addListener('beforeRemove', () => {
        // Delay the reset to avoid flickering
        setTimeout(() => {
          setTags([]);
        }, 300);
      });

      return () => {
        unsubscribe();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  useEffect(() => {
    if (isEditBusiness && businessData?.tags) {
      setSelected(businessData?.tags);
    } else if (storeTags) {
      setSelected(storeTags);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (select: Tag) => {
    //Check if tag is selected or not
    const isItemSelected = selected.includes(select.name);

    if (!isItemSelected) {
      //Add Tag into selected tags when not available
      const selectedTags = [...selected];
      selectedTags.push(select.name);
      setSelected(selectedTags);
      setTags(selectedTags);
    } else {
      //Remove Tag from selected tags if already available
      const updatedTags = selected.filter(
        (item: string) => item !== select.name,
      );
      setSelected(updatedTags);
      setTags(updatedTags);
    }
  };

  const onSearch = (keyword: string) => {
    setSearch(keyword);
    if (!keyword) {
      setItems(tags ?? []);
    } else {
      setItems(
        tags?.filter((item: Tag) => {
          return item.name.toUpperCase().includes(keyword.toUpperCase());
        }),
      );
    }
  };

  const onSubmit = () => {
    if (isEditBusiness) {
      editTags(
        {
          businessId: route.params.businessId,
          data: { tags: selected },
        },
        {
          onSuccess() {
            navigation.goBack();
          },
        },
      );
    } else {
      setTags(selected);
      navigation.navigate('Telephone');
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
        title={isEditBusiness ? 'Edit Tags' : 'Select Tags'}
        renderLeft={() => <ArrowBack show={!!isEditBusiness} />}
        onPressLeft={navigateToBack}
      />

      <KeyboardAvoidingView
        behavior={Platform.select({ android: undefined, ios: 'padding' })}
        keyboardVerticalOffset={offsetKeyboard}
        style={styles.keyboardAvoidView}>
        <View style={styles.container}>
          <Text title2 bold>
            Select tags related to your business, To help users find your
            business through our search engine <Text body1>(optional)</Text>
          </Text>
          {tags ? (
            <TextInput
              style={styles.input}
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

          <ScrollView style={styles.scrollView}>
            {items?.map((item, index) => {
              const checked = selected.includes(item.name);
              return (
                <SelectItem
                  key={`${index + item.name}`}
                  onPress={() => onChange(item)}
                  text={item.name}
                  checked={checked}
                />
              );
            })}
          </ScrollView>
        </View>

        <NavigationButtons
          onSubmit={onSubmit}
          loading={isLoading}
          disabled={isLoading}
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
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
    paddingBottom: 10,
  },
  scrollView: {
    flex: 1,
  },
  input: {
    marginTop: 15,
  },
});
