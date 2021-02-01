import React, { useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { BaseStyle, BaseColor, useTheme, Images } from '@config';
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
import styles from './styles';
import { getCategories } from '../../actions/category';

export default function Category({ navigation }) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.all);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [modeView, setModeView] = useState('icon');

  useEffect(() => {
    dispatch(
      getCategories({}, () => {
        setLoading(false);
      }),
    );
  }, [dispatch]);

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
  const onSearch = (close) => {
    setLoading(true);
    if (search === '' || close === 'close') {
      dispatch(
        getCategories({}, () => {
          setLoading(false);
        }),
      );
    } else {
      dispatch(
        getCategories({ search }, () => {
          setLoading(false);
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
            title={item.name}
            // subtitle={200}
            onPress={() =>
              navigation.navigate('Place', {
                title: item.name,
                category: item.name,
                route: item.route,
              })
            }
            style={[styles.itemIcon, { borderColor: colors.border }]}
          />
        );
      case 'full':
        return (
          <CategoryFull
            image={{
              uri: item.image || 'https://i.ibb.co/VpvP0X5/empty-image.jpg',
            }}
            icon={item.icon}
            title={item.name}
            // subtitle={300}
            onPress={() =>
              navigation.navigate('Place', {
                title: item.name,
                category: item.name,
                route: item.route,
              })
            }
            style={styles.itemFull}
          />
        );
      default:
        break;
    }
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <Header
        title={t('categories')}
        renderLeft={() => {
          return <Icon name="arrow-left" size={20} color={colors.primary} />;
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        renderRight={() => {
          return (
            <Icon
              name={modeView === 'full' ? 'th-large' : 'th-list'}
              size={20}
              color={BaseColor.grayColor}
            />
          );
        }}
        onPressRight={onChangeView}
      />
      <View style={{ paddingHorizontal: 20, paddingVertical: 15 }}>
        <TextInput
          onChangeText={(text) => setSearch(text)}
          placeholder={t('search')}
          value={search}
          onSubmitEditing={onSearch}
          autoCapitalize="characters"
          icon={
            <TouchableOpacity
              onPress={() => {
                setSearch('');
                onSearch('close');
              }}>
              <Icon name="times" size={16} color={BaseColor.grayColor} />
            </TouchableOpacity>
          }
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          contentContainerStyle={{
            paddingHorizontal: 20,
          }}
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                dispatch(
                  getCategories({}, () => {
                    setRefreshing(false);
                  }),
                );
              }}
            />
          }
          data={categories}
          keyExtractor={(item, index) => item.id}
          renderItem={({ item, index }) => renderItem(item, index)}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text body2 style={{ textAlign: 'center' }}>
                {t('data_not_found')}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
