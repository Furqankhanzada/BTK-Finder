import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Header, Text, TextInput, Button, Icon } from '@components';
import { BaseColor, BaseStyle, useTheme } from '@config';
import remoteConfig from '@react-native-firebase/remote-config';
import useAddBusinessStore from '../store/Store';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';
import { NewAddBusinessPresentable } from '../models/AddNewBusinessPresentable';
import { useBusiness } from '@screens/businesses/queries/queries';
import { useEditBusiness } from '../queries/mutations';

export const TagsScreen = ({
  navigation,
  route,
}: StackScreenProps<GlobalParamList>) => {
  const [active, setActive] = useState<boolean>(false);
  const [search, setSearch] = useState<string>();
  const [tags, setTags] = useState<Array<NewAddBusinessPresentable>>([]);
  const [selected, setSelected] = useState<Array<NewAddBusinessPresentable>>(
    [],
  );

  const [items, setItems] = useState(tags);
  const [edit, setEdit] = useState<any>();

  const { mutate: editTags } = useEditBusiness(route?.params?.id);

  const { data: businessData } = useBusiness(route?.params?.id);
  const setTag = useAddBusinessStore((state: any) => state.setTags);
  const isEditBusiness = useAddBusinessStore(
    (state: any) => state.isEditBusiness,
  );

  const { colors } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    const getTags = remoteConfig().getValue('tags');
    getTags ? setTags(JSON.parse(getTags._value)) : null;
  }, []);

  useEffect(() => {
    // console.log('Business Data', businessData);
    if (isEditBusiness) {
      setSelected(businessData?.tags);
      setActive(true);
      // console.log('Selected Tags', businessData?.tags);
    }
  }, [businessData?.tags, isEditBusiness]);

  const onChange = (select: NewAddBusinessPresentable) => {
    const isItemSelected = selected.some(
      (obj: NewAddBusinessPresentable) => obj.name === select.name,
      setActive(true),
    );
    if (!isItemSelected) {
      setSelected([...selected, select]);
      const selectedArray = [...selected, select];

      const selectedTags: (string | undefined)[] = [];
      const tagsName = selectedArray.map(
        (tagName: NewAddBusinessPresentable) => {
          // console.log('Tag Name', tagName.name);

          return selectedTags.push(tagName.name);
        },
      );
      // console.log('Selected Tags Name', selectedTags);

      setTag(selectedTags);
      setEdit(selectedTags);
    } else {
      const arr = selected.filter(
        (item: NewAddBusinessPresentable) => item.name != select.name,
      );
      setSelected(arr);

      const unSelectedTags: (string | undefined)[] = [];
      const tagsName = arr.map((tagName: NewAddBusinessPresentable) => {
        return unSelectedTags.push(tagName.name);
      });
      setTag(unSelectedTags);
    }
  };

  const onSearch = (keyword: string) => {
    setSearch(keyword);
    if (!keyword) {
      setItems(tags ?? []);
    } else {
      setItems(
        items?.filter((item: object) => {
          return item.name.toUpperCase().includes(search.toUpperCase());
        }),
      );
    }
  };

  const navigateToNext = () => {
    if (isEditBusiness) {
      editTags({ tags: edit });
      setSelected(edit.name);
      // console.log('What is edit', edit);
      navigation.navigate('EditBusiness', { id: businessData?._id });
    } else {
      navigation.navigate('Telephone');
    }
  };

  const navigateToBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={isEditBusiness ? 'Update Tags' : 'Select Tags'}
        renderRight={() => {
          return isEditBusiness ? null : <Text>Skip</Text>;
        }}
        onPressRight={navigateToNext}
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
          navigation.navigate('EditBusiness', { id: businessData?._id });
        }}
      />
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
          contentContainerStyle={{ paddingVertical: 10 }}
          data={tags}
          keyExtractor={(item: object, index: any) => {
            return index;
          }}
          renderItem={({ item, index }: any) => {
            const checked = selected.some(
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
        style={isEditBusiness ? styles.stickyFooterEdit : styles.stickyFooter}>
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
          {isEditBusiness ? 'Update Tags' : 'Next'}
        </Button>
      </View>
    </SafeAreaView>
  );
};
