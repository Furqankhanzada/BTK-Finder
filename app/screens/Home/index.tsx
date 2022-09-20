import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Animated,
  TouchableOpacity,
  FlatList,
  Alert,
  Linking,
  Platform,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { checkNotifications } from 'react-native-permissions';
import {
  Header,
  Button,
  Text,
  Icon,
  SafeAreaView,
  CardList,
  PlaceItem,
} from '@components';
import { BaseColor, useTheme, BaseStyle } from '@config';

import styles from './styles';
import FeaturedCategoryPlaceholderComponent from '../../components/Placeholders/featuredCategories';
import CustomSectionList from './CustomSectionList';
import { getCategories } from '../../actions/category';
import { getBusinesses } from '../../actions/business';
import { getFavoriteBusinesses } from '../../actions/favorites';
import { getProfile } from '../../actions/auth';
import useLocation from '../../hooks/useLocation';
import { trackEvent, EVENTS, setUser } from '../../userTracking';

export default function Home({ navigation }: any) {
  const stateProps = useSelector(({ businesses, favorites }: any) => {
    return {
      popularBusinesses: businesses.popularBusinesses,
      getPopularBusinessesLoading: businesses.getPopularBusinessesLoading,
      recentlyAddedBusinesses: businesses.recentlyAddedBusinesses,
      getRecentlyAddedBusinessesLoading:
        businesses.getRecentlyAddedBusinessesLoading,
      favoriteBusinesses: favorites.getFavoriteBusinesses,
    };
  });

  const onHelpLineClick = () => {
    navigation.navigate('HelpLine');
    trackEvent(EVENTS.HELPLINE_SCREEN_VISITED);
  };

  const isLogin = useSelector((state: any) => state.auth.isLogin);
  const profileData = useSelector((state: any) => state.profile);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const deltaY = new Animated.Value(0);
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const getLocation: any = useLocation();
  let placeholderItems = [1, 2, 3, 4, 5, 6, 7, 8];
  let featuredCategories = useSelector(
    (state: any) => state.categories.featured,
  );
  featuredCategories = [
    ...featuredCategories,
    ...[
      {
        id: '5',
        color: BaseColor.kashmir,
        icon: 'ellipsis-h',
        name: 'more',
        route: 'Category',
      },
    ],
  ];

  useEffect(() => {
    checkNotifications().then(({ status }) => {
      let message =
        Platform.OS === 'android'
          ? 'Open Settings > Manage Notifications > Allow notifications from Explore BTK'
          : 'Open Settings > Notifications > Allow notifications from Explore BTK';
      if (status === 'blocked') {
        Alert.alert(
          'Allow Notifications',
          message,
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ],
          {
            cancelable: false,
          },
        );
      }
    });
  }, []);

  useEffect(() => {
    if (isLogin) {
      if (profileData?._id) {
        setUser(profileData);
      }
    }
  }, [isLogin, profileData, profileData?._id]);

  useEffect(() => {
    if (isLogin) {
      dispatch(getProfile());
      dispatch(
        getFavoriteBusinesses({
          favorite: true,
          skip: 0,
          fields: 'name, thumbnail, category, averageRatings',
        }),
      );
    }
  }, [dispatch, isLogin]);

  useEffect(() => {
    dispatch(
      getCategories(
        { limit: 7 },
        () => {
          setLoading(false);
        },
        true,
      ),
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getBusinesses({
        limit: 15,
        skip: 0,
        popular: true,
        fields: 'name, thumbnail, category, address, averageRatings',
      }),
    );
    dispatch(
      getBusinesses({
        limit: 15,
        skip: 0,
        recent: true,
        fields: 'name, thumbnail, category, averageRatings',
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    if (
      !stateProps.getPopularBusinessesLoading &&
      !stateProps.getRecentlyAddedBusinessesLoading &&
      !loading
    ) {
      setIsRefreshing(false);
      setLoading(false);
    }
  }, [
    stateProps.getPopularBusinessesLoading,
    stateProps.getRecentlyAddedBusinessesLoading,
    loading,
  ]);

  const navigateBusinessDetail = (id: string, name: string, type: string) => {
    navigation.navigate('BusinessDetailTabNavigator', { id });

    const business = {
      id,
      name,
    };

    if (type === 'popularBusiness') {
      trackEvent(EVENTS.POPULAR_BUSINESS_VISITED, business);
    } else {
      trackEvent(EVENTS.RECENTLY_ADDED_BUSINESS_VISITED, business);
    }
  };

  const seeMore = (payload: any = {}) => {
    if (payload.route === 'Category') {
      navigation.navigate('Category', {
        latitude: getLocation?.latitude ?? null,
        longitude: getLocation?.longitude ?? null,
      });
      trackEvent(EVENTS.CATEGORIES_SCREEN_VISITED);
    } else {
      navigation.navigate('Place', payload);
      trackEvent(EVENTS.CATEGORY_VISITED, {
        title: payload.title,
        category: payload.category,
      });
    }
  };

  const navigateToFilter = () => {
    navigation.navigate('Filter', {
      home: true,
      coordinates: {
        latitude: getLocation?.latitude ?? null,
        longitude: getLocation?.longitude ?? null,
      },
    });
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setLoading(true);
    dispatch(
      getBusinesses({
        limit: 15,
        skip: 0,
        popular: true,
        fields: 'name, thumbnail, category, address, averageRatings',
      }),
    );
    dispatch(
      getBusinesses({
        limit: 15,
        skip: 0,
        recent: true,
        fields: 'name, thumbnail, category, averageRatings',
      }),
    );
    dispatch(
      getCategories(
        { limit: 7 },
        () => {
          setLoading(false);
        },
        true,
      ),
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Header
          title={'Explore BTK'}
          renderRight={() => {
            return (
              <Button
                styleText={{ marginLeft: 5, fontSize: 10 }}
                style={{ width: 80, paddingHorizontal: 10, height: 25 }}
                icon={<Icon name={'phone'} size={10} color={'white'} solid />}
                full
                round
                onPress={onHelpLineClick}>
                {t('help_line')}
              </Button>
            );
          }}
        />
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: { y: deltaY },
                },
              },
            ],
            { useNativeDriver: false },
          )}
          scrollEventThrottle={8}>
          <View
            style={[
              styles.searchForm,
              {
                marginTop: 10,
                marginBottom: 10,
                backgroundColor: colors.background,
                borderColor: colors.border,
                shadowColor: colors.border,
              },
            ]}>
            <TouchableOpacity onPress={navigateToFilter}>
              <View
                style={[BaseStyle.textInput, { backgroundColor: colors.card }]}>
                <Text body1 grayColor style={{ flex: 1 }}>
                  {t('search_businesses')}
                </Text>
                <View style={{ paddingVertical: 8 }}>
                  <View
                    style={[
                      styles.lineForm,
                      { backgroundColor: colors.border },
                    ]}
                  />
                </View>
                <Icon
                  name="location-arrow"
                  size={18}
                  color={colors.primary}
                  solid
                />
              </View>
            </TouchableOpacity>
          </View>

          {loading ? (
            <FlatList
              contentContainerStyle={{ padding: 20 }}
              data={placeholderItems}
              numColumns={4}
              renderItem={() => {
                return (
                  <View style={styles.serviceItem}>
                    <FeaturedCategoryPlaceholderComponent />
                  </View>
                );
              }}
            />
          ) : (
            <FlatList
              contentContainerStyle={{ padding: 20 }}
              data={featuredCategories}
              numColumns={4}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    style={styles.serviceItem}
                    onPress={() =>
                      seeMore({
                        title: item.name,
                        category: item.name,
                        categoryIcon: item.icon,
                        route: item.route,
                        latitude: getLocation?.latitude ?? null,
                        longitude: getLocation?.longitude ?? null,
                      })
                    }>
                    <View
                      style={[
                        styles.serviceCircleIcon,
                        { backgroundColor: item.color },
                      ]}>
                      <Icon
                        name={item.icon}
                        size={20}
                        color={BaseColor.whiteColor}
                        solid
                      />
                    </View>
                    <Text footnote numberOfLines={1}>
                      {t(item.name)}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          )}
          {/* Popular Businesses Section */}
          <CustomSectionList
            title="Popular Businesses"
            subTitle="Find the most interesting things"
            seeMoreFunc={() =>
              seeMore({
                popular: true,
                title: 'Popular Businesses',
                latitude: getLocation?.latitude ?? null,
                longitude: getLocation?.longitude ?? null,
              })
            }
            data={stateProps.popularBusinesses}
            horizontal={true}
            loading={stateProps.getPopularBusinessesLoading}
            renderItem={({ item }: any) => {
              return (
                <PlaceItem
                  grid
                  image={item?.thumbnail}
                  title={item.name}
                  subtitle={item.category}
                  location={item?.address}
                  rate={item?.averageRatings || 0.0}
                  isFavorite={stateProps?.favoriteBusinesses?.some(
                    (obj: any) => obj._id === item?._id,
                  )}
                  businessId={item?._id}
                  navigation={navigation}
                  lastRoute="Home"
                  // status='Open Now'
                  onPress={() =>
                    navigateBusinessDetail(
                      item._id,
                      item.name,
                      'popularBusiness',
                    )
                  }
                  style={{ marginLeft: 15, width: 175 }}
                />
              );
            }}
          />
          {/* Recently Added Businesses Section */}
          <CustomSectionList
            title="Recently Added Businesses"
            subTitle="Lets find out what's new"
            seeMoreFunc={() =>
              seeMore({
                recent: true,
                title: 'Recently Added Businesses',
                latitude: getLocation?.latitude ?? null,
                longitude: getLocation?.longitude ?? null,
              })
            }
            data={stateProps.recentlyAddedBusinesses}
            loading={stateProps.getRecentlyAddedBusinessesLoading}
            renderItem={({ item }: any) => {
              return (
                <CardList
                  key={item._id}
                  image={item?.thumbnail}
                  title={item.name}
                  subtitle={item.category}
                  rate={item?.averageRatings || 0.0}
                  style={{ marginBottom: 15 }}
                  onPress={() =>
                    navigateBusinessDetail(
                      item._id,
                      item.name,
                      'recentBusiness',
                    )
                  }
                />
              );
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
