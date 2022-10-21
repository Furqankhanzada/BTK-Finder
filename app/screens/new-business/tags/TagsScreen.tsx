import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, TouchableOpacity, View } from 'react-native';

import { Header, Text, TextInput, Button, Icon } from '@components';
import { BaseStyle, useTheme } from '@config';
import remoteConfig from '@react-native-firebase/remote-config';
import useAddBusinessStore from '../store/Store';

import { StackScreenProps } from '@react-navigation/stack';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { styles } from '../styles/styles';
import { useTranslation } from 'react-i18next';

export const TagsScreen = ({
  navigation,
}: StackScreenProps<GlobalParamList>) => {
  const [active, setActive] = useState<boolean>(false);
  const [search, setSearch] = useState<any>();
  const [tags, setTags] = useState([]);
  const [selected, setSelected] = useState<any>([]);
  const [items, setItems] = useState(tags);

  const setTag = useAddBusinessStore((state: any) => state.setTags);

  const { colors } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    const getTags = remoteConfig().getValue('tags');
    getTags ? setTags(JSON.parse(getTags._value)) : null;
  }, []);

  const onChange = (select: any) => {
    const isItemSelected = selected.some(
      (obj: any) => obj.name === select.name,
      setActive(true),
    );
    if (!isItemSelected) {
      setSelected([...selected, select]);
      setTag([...selected, select]);
    } else {
      const arr = selected.filter((item: any) => item.name != select.name);
      setSelected(arr);
      setTag(arr);
    }
  };

  const onSearch = (keyword: any) => {
    setSearch(keyword);
    if (!keyword) {
      setItems(tags ?? []);
    } else {
      setItems(
        items?.filter((item: any) => {
          return item.name.toUpperCase().includes(search.toUpperCase());
        }),
      );
    }
  };

  const navigateToNext = () => {
    navigation.navigate('Telephone');
  };

  const navigateToBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title="Select Tags"
        renderRight={() => {
          return <Text>Skip</Text>;
        }}
        onPressRight={navigateToNext}
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
          keyExtractor={(item: any, index) => item.id}
          renderItem={({ item }) => {
            const checked = selected.some((obj: any) => obj.name === item.name);
            return (
              <TouchableOpacity
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
          <Button style={styles.footerButtons} onPress={() => navigateToNext()}>
            {'Next'}
          </Button>
        ) : null}
      </View>
    </SafeAreaView>
  );
};
