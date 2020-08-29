import React, {useState} from 'react';
import {FlatList, RefreshControl, View, TouchableOpacity} from 'react-native';
import {BaseStyle, BaseColor, useTheme} from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  CategoryFull,
  CategoryIcon,
  TextInput,
  Text,
} from '@components';
import * as Utils from '@utils';
import {CategoryData} from '@data';
import styles from './styles';
import {useTranslation} from 'react-i18next';

export default function Category({navigation}) {
  const {t} = useTranslation();
  const {colors} = useTheme();

  const [refreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [modeView, setModeView] = useState('full');
  const [category, setCategory] = useState(CategoryData);

  /**
   * call when change mode view
   */
  const onChangeView = () => {
    Utils.enableExperimental();
    switch (modeView) {
      case 'full':
        setModeView('icon');
        break;
      case 'icon':
        setModeView('full');
        break;
    }
  };

  /**
   * call when search category
   */
  const onSearch = () => {
    if (search == '') {
      setCategory(CategoryData);
    } else {
      setCategory(
        category.filter(item => {
          return item.title.toUpperCase().includes(search.toUpperCase());
        }),
      );
    }
  };

  /**
   * render Item category
   * @param {*} item
   * @param {*} index
   * @returns
   */
  const renderItem = (item, index) => {
    switch (modeView) {
      case 'icon':
        return (
          <CategoryIcon
            icon={item.icon}
            title={item.title}
            subtitle={item.subtitle}
            onPress={() => navigation.navigate(item.screen)}
            style={[styles.itemIcon, {borderColor: colors.border}]}
          />
        );
      case 'full':
        return (
          <CategoryFull
            image={item.image}
            icon={item.icon}
            title={item.title}
            subtitle={item.subtitle}
            onPress={() => navigation.navigate(item.screen)}
            style={{
              marginBottom: 15,
            }}
          />
        );
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
      <Header
        title={t('category')}
        renderLeft={() => {
          return <Icon name="arrow-left" size={20} color={colors.primary} />;
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        renderRight={() => {
          return (
            <Icon
              name={modeView == 'full' ? 'th-large' : 'th-list'}
              size={20}
              color={BaseColor.grayColor}
            />
          );
        }}
        onPressRight={onChangeView}
      />
      <View style={{paddingHorizontal: 20, paddingVertical: 15}}>
        <TextInput
          onChangeText={text => setSearch(text)}
          placeholder={t('search')}
          value={search}
          onSubmitEditing={onSearch}
          icon={
            <TouchableOpacity
              onPress={() => {
                setSearch('');
                onSearch();
              }}>
              <Icon name="times" size={16} color={BaseColor.grayColor} />
            </TouchableOpacity>
          }
        />
      </View>
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: 20,
          flex: 1,
        }}
        refreshControl={
          <RefreshControl
            colors={[colors.primary]}
            tintColor={colors.primary}
            refreshing={refreshing}
          />
        }
        data={category}
        keyExtractor={(item, index) => item.id}
        renderItem={({item, index}) => renderItem(item, index)}
        ListEmptyComponent={
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text body2 style={{textAlign: 'center'}}>
              {t('data_not_found')}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
