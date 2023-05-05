import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import remoteConfig from '@react-native-firebase/remote-config';
import { StackScreenProps } from '@react-navigation/stack';

import { BaseStyle, BaseColor, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  Tag,
  TextInput,
  Loading,
  Button,
} from '@components';
import * as Utils from '@utils';

import { EVENTS, trackEvent } from '../../userTracking';
import { GlobalParamList } from '../../navigation/models/GlobalParamList';
import { useCategories } from '@screens/category/queries/queries';

export default function Filter(
  props: StackScreenProps<GlobalParamList, 'Filter'>,
) {
  const { navigation, route } = props;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { isLoading, data: categories } = useCategories(['categories']);

  const [search, setSearch] = useState<string>();
  const [selectedCategories, setSelectedCategories] = useState<
    Array<{ name: string }>
  >([]);
  const [selectedTags, setSelectedTags] = useState<Array<{ name: string }>>([]);
  const [tags, setTags] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState<
    Array<{ name: string }>
  >([]);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  useEffect(() => {
    const getFacilities: any = remoteConfig().getValue('facilities');
    getFacilities._value
      ? setFacilities(JSON.parse(getFacilities._value))
      : null;
  }, []);

  useEffect(() => {
    const getTags: any = remoteConfig().getValue('tags');
    getTags ? setTags(JSON.parse(getTags._value)) : null;
  }, []);

  useEffect(() => {
    if (route.params?.category) {
      if (Array.isArray(route.params.category)) {
        setSelectedCategories(route.params.category.map((c) => ({ name: c })));
      } else {
        setSelectedCategories([
          {
            name: route.params.category,
          },
        ]);
      }
    }

    if (route.params?.tags) {
      if (Array.isArray(route.params.tags)) {
        setSelectedTags(route.params.tags.map((c) => ({ name: c })));
      } else {
        setSelectedTags([
          {
            name: route.params.category as string,
          },
        ]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAddCategory = () => {
    navigation.navigate('ChooseItems', {
      onApply: (data) => {
        setSelectedCategories(data);
      },
      items: categories,
      selected: selectedCategories,
      title: 'Categories',
    });
  };

  const onAddTags = () => {
    navigation.navigate('ChooseItems', {
      onApply: (data) => {
        setSelectedTags(data);
      },
      items: tags,
      selected: selectedTags,
      title: 'Tags',
      search: true,
    });
  };

  const onAddFacility = () => {
    navigation.navigate('ChooseItems', {
      onApply: (data) => {
        setSelectedFacilities(data);
      },
      items: facilities,
      selected: selectedFacilities,
      title: 'Facilities',
    });
  };

  const onApply = () => {
    navigation.navigate('Businesses', {
      title: 'Search Results',
      isFiltering: true, // don't cache and stale query (our key logic does not work here)
      ...(search ? { search } : {}),
      ...(route.params?.popular ? { popular: route.params.popular } : {}),
      ...(route.params?.recent ? { recent: route.params.recent } : {}),
      ...(selectedCategories.length
        ? { category: selectedCategories.map((e) => e.name) }
        : {}),
      ...(selectedTags.length ? { tags: selectedTags.map((e) => e.name) } : {}),
      ...(selectedFacilities.length
        ? { facilities: selectedFacilities.map((e) => e.name) }
        : {}),
    });

    trackEvent(EVENTS.APPLY_FILTERS, {
      search: search,
      category: selectedCategories,
      tags: selectedTags,
      facilities: selectedFacilities,
      recent: route.params?.recent,
      popular: route.params?.popular,
    });
  };

  const onClearFilter = () => {
    setSearch('');
    setSelectedTags([]);
    setSelectedCategories([]);
    setSelectedFacilities([]);
  };

  const clearFilterButton = () => {
    if (
      search ||
      selectedTags?.length ||
      selectedCategories?.length ||
      selectedFacilities?.length
    ) {
      return (
        <>
          <Button
            round
            outline={true}
            icon={
              <Icon
                name={'times'}
                size={15}
                color={colors.primary}
                solid
                style={styles.clearIcon}
              />
            }
            style={styles.clearFilterButton}
            onPress={() => onClearFilter()}>
            Clear Filters
          </Button>
          <Button round style={styles.searchButton} onPress={() => onApply()}>
            Search
          </Button>
        </>
      );
    }
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Loading loading={isLoading} />
      <Header
        title={t('filtering')}
        renderLeft={() => {
          return <Icon name="times" size={20} color={colors.primary} />;
        }}
        renderRight={() => {
          return (
            <Text headline primaryColor numberOfLines={1}>
              {t('apply')}
            </Text>
          );
        }}
        onPressLeft={() => navigation.goBack()}
        onPressRight={() => onApply()}
      />
      <ScrollView
        scrollEnabled={scrollEnabled}
        onContentSizeChange={(contentWidth, contentHeight) =>
          setScrollEnabled(Utils.scrollEnabled(contentWidth, contentHeight))
        }>
        <View style={styles.container}>
          <TextInput
            onChangeText={(text) => setSearch(text)}
            placeholder={t('search')}
            value={search}
            blurOnSubmit={true}
            icon={
              <TouchableOpacity
                onPress={() => {
                  setSearch('');
                }}
                style={styles.btnClearSearch}>
                <Icon name="times" size={18} color={BaseColor.grayColor} />
              </TouchableOpacity>
            }
          />
          <Text headline semibold style={styles.sectionText}>
            {t('categories').toUpperCase()}
          </Text>
          <View style={styles.wrapContent}>
            {selectedCategories.map((item: any) => {
              return (
                <Tag
                  outline={true}
                  icon={
                    <Icon
                      name={item.icon}
                      size={12}
                      color={colors.primary}
                      solid
                      style={styles.tagIcon}
                    />
                  }
                  key={item.name}
                  style={styles.tag}>
                  {item.name}
                </Tag>
              );
            })}
            <TouchableOpacity
              onPress={() => onAddCategory()}
              style={[styles.addItem, { backgroundColor: colors.primary }]}>
              <Text style={styles.tagAddText}>Add Category</Text>
              <Icon size={10} name="plus" color="white" />
            </TouchableOpacity>
          </View>
          <Text headline semibold style={styles.sectionText}>
            {t('tags').toUpperCase()}
          </Text>
          <View style={styles.wrapContent}>
            {selectedTags.map((item) => {
              return (
                <Tag outline={true} key={item.name} style={styles.selectedTag}>
                  {item.name}
                </Tag>
              );
            })}
            <TouchableOpacity
              onPress={() => onAddTags()}
              style={[styles.addItem, { backgroundColor: colors.primary }]}>
              <Text style={styles.tagAddText}>Add Tag</Text>
              <Icon size={10} name="plus" color="white" />
            </TouchableOpacity>
          </View>
          <Text headline semibold style={styles.sectionText}>
            {t('facilities').toUpperCase()}
          </Text>
          <View style={styles.wrapContent}>
            {selectedFacilities.map((item: any) => {
              return (
                <Tag
                  icon={
                    <Icon
                      name={item.icon}
                      size={12}
                      color={colors.accent}
                      solid
                      style={styles.tagIcon}
                    />
                  }
                  chip
                  key={item.name}
                  style={styles.tag}>
                  {item.name}
                </Tag>
              );
            })}
            <TouchableOpacity
              onPress={() => onAddFacility()}
              style={[styles.addItem, { backgroundColor: colors.accent }]}>
              <Text style={styles.tagAddText}>Add Facility</Text>
              <Icon size={10} name="plus" color="white" />
            </TouchableOpacity>
          </View>
          {clearFilterButton()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  wrapContent: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  contentRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    marginTop: 10,
  },
  contentResultRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  contentList: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
  },
  circleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnClearSearch: {
    position: 'absolute',
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: '100%',
  },
  locationContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  addItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 7,
    borderRadius: 20,
    marginTop: 8,
  },
  rowTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clearIcon: {
    marginRight: 5,
  },
  clearFilterButton: {
    marginTop: 40,
  },
  searchButton: {
    marginTop: 10,
  },
  sectionText: {
    marginTop: 30,
  },
  tag: {
    marginTop: 8,
    marginRight: 8,
  },
  tagIcon: {
    marginRight: 5,
  },
  selectedTag: {
    marginTop: 8,
    marginRight: 8,
  },
  tagAddText: {
    fontSize: 10,
    marginRight: 5,
    color: 'white',
  },
});
