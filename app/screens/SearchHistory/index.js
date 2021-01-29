import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { BaseStyle, BaseColor, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  TextInput,
  Icon,
  Text,
  Loading,
} from '@components';
import styles from './styles';
import {
  getAllBusinesses,
  setSearchBusiness,
  setSearchHistory,
  clearSearchHistory,
} from '../../actions/business';
import Toast from 'react-native-simple-toast';

export default function SearchHistory(props) {
  const { navigation, route } = props;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const stateProps = useSelector(({ businesses }) => {
    return {
      loading: businesses.getAllBusinessesLoading,
      searchHistory: businesses.searchHistory,
    };
  });

  const [search, setSearch] = useState('');
  const onSearch = () => {
    let payload = {
      limit: 10,
      skip: 0,
      search: search,
      loading: true,
    };
    if (route?.params?.popular) {
      payload.popular = true;
    }
    if (route?.params?.category) {
      payload.category = route.params.category;
    }
    dispatch(setSearchBusiness(search));
    dispatch(setSearchHistory(search));
    dispatch(getAllBusinesses(payload, navigation.goBack()));
  };

  const clearHistoryToast = () => {
    return Toast.show('Search History Cleared');
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <Loading loading={stateProps.loading} />
      <Header
        title={t('search')}
        renderLeft={() => {
          return <Icon name="times" size={20} color={colors.primary} />;
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <TextInput
            onChangeText={(text) => setSearch(text)}
            placeholder={t('search')}
            value={search}
            onSubmitEditing={() => {
              onSearch();
            }}
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
          <View style={{ paddingTop: 20 }}>
            <View style={styles.rowTitle}>
              <Text headline>{t('search_history').toUpperCase()}</Text>
              <TouchableOpacity
                onPress={() => dispatch(clearSearchHistory(clearHistoryToast))}>
                <Text caption1 accentColor>
                  {t('clear')}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
              }}>
              {stateProps?.searchHistory?.length ? (
                stateProps?.searchHistory?.map((item, index) => (
                  <TouchableOpacity
                    style={[
                      styles.itemHistory,
                      { backgroundColor: colors.card },
                    ]}
                    onPress={() => {}}
                    key={'search' + index}>
                    <Text caption2>{item}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.emptyHistoryArea}>
                  <Icon
                    name="search"
                    color={colors.text}
                    size={30}
                    style={{ marginBottom: 10 }}
                  />
                  <Text>Search history will appear here</Text>
                </View>
              )}
            </View>
          </View>
          {/*<View style={{ paddingTop: 20 }}>*/}
          {/*  <View style={styles.rowTitle}>*/}
          {/*    <Text headline>{t('discover_more').toUpperCase()}</Text>*/}
          {/*    <TouchableOpacity>*/}
          {/*      <Text caption1 accentColor>*/}
          {/*        {t('refresh')}*/}
          {/*      </Text>*/}
          {/*    </TouchableOpacity>*/}
          {/*  </View>*/}
          {/*  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>*/}
          {/*    {discoverMore.map((item, index) => (*/}
          {/*      <TouchableOpacity*/}
          {/*        style={[styles.itemHistory, { backgroundColor: colors.card }]}*/}
          {/*        key={'discover' + index}>*/}
          {/*        <Text caption2>{item.keyword}</Text>*/}
          {/*      </TouchableOpacity>*/}
          {/*    ))}*/}
          {/*  </View>*/}
          {/*</View>*/}
          {/*<View style={{ paddingTop: 20 }}>*/}
          {/*  <Text headline>{t('recently_view').toUpperCase()}</Text>*/}
          {/*  <FlatList*/}
          {/*    horizontal={true}*/}
          {/*    showsHorizontalScrollIndicator={false}*/}
          {/*    data={recentlyView}*/}
          {/*    keyExtractor={(item, index) => item.id}*/}
          {/*    renderItem={({ item, index }) => (*/}
          {/*      <Card*/}
          {/*        style={{*/}
          {/*          width: 100,*/}
          {/*          height: 100,*/}
          {/*          marginRight: 20,*/}
          {/*          marginTop: 5,*/}
          {/*        }}*/}
          {/*        image={item.image}*/}
          {/*        onPress={() => navigation.navigate('HotelDetail')}>*/}
          {/*        <Text headline semibold whiteColor>*/}
          {/*          {item.name}*/}
          {/*        </Text>*/}
          {/*      </Card>*/}
          {/*    )}*/}
          {/*  />*/}
          {/*</View>*/}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
