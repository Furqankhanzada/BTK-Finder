import React, { useState } from 'react';
import {
  FlatList,
  RefreshControl,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import * as Utils from '@utils';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { BaseStyle, BaseColor, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  CategoryFull,
  CategoryIcon,
  TextInput,
  Text,
} from '@components';

import axiosApiInstance from '../../../app/interceptor/axios-interceptor';
import Config from 'react-native-config';

interface Props {
  navigation: any;
  route: any;
}

export default function CategoryScreen(props: Props) {
  const { navigation, route } = props;

  const { t } = useTranslation();
  const { colors } = useTheme();

  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [modeView, setModeView] = useState('icon');

  const fetchBusinessCatagory = () => {
    return axiosApiInstance({
      method: 'GET',
      url: `${Config.API_URL}/categories`,
    });
  };

  const {
    isLoading,
    data: catagory,
    refetch,
  } = useQuery(['business-catagory'], fetchBusinessCatagory, {});

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

  const onSearch = (close: String) => {
    isLoading;
    if (search === '' || close === 'close') {
      return catagory?.data.name;
    } else {
      return '';
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderItem = (item: any) => {
    switch (modeView) {
      case 'icon':
        return (
          <CategoryIcon
            icon={item.icon}
            title={item.name}
            onPress={() =>
              navigation.navigate('Place', {
                title: item.name,
                category: item.name,
                categoryIcon: item.icon,
                route: item.route,
                latitude: route?.params?.latitude ?? null,
                longitude: route?.params?.longitude ?? null,
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
        return null;
    }
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
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
      {isLoading ? (
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
              onRefresh={onRefresh}
            />
          }
          data={catagory?.data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderItem(item)}
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

const styles = StyleSheet.create({
  contain: {
    flexDirection: 'row',
    height: Utils.scaleWithPixel(115),
    borderRadius: 8,
  },
  contentIcon: {
    position: 'absolute',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemFull: {
    marginBottom: 15,
    backgroundColor: '#e1e4e8',
  },
  itemIcon: {
    marginBottom: 10,
    borderBottomWidth: 0.5,
    paddingBottom: 10,
  },
});
