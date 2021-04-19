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
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { checkNotifications } from 'react-native-permissions';
import VersionCheck from 'react-native-version-check';
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
import * as Utils from '@utils';
import styles from './styles';
import { HomeBannerData } from '@data';
import FeaturedCategoryPlaceholderComponent from '../../components/Placeholders/featuredCategories';
import SectionList from './sectionList';
import { getCategories } from '../../actions/category';
import { getBusinesses } from '../../actions/business';
import { getFavoriteBusinesses } from '../../actions/favorites';
import { getProfile } from '../../actions/auth';
import useLocation from '../../hooks/useLocation';
export default function Home({ navigation }) {
  const stateProps = useSelector(({ businesses, favorites }) => {
    return {
      popularBusinesses: businesses.popularBusinesses,
      getPopularBusinessesLoading: businesses.getPopularBusinessesLoading,
      recentlyAddedBusinesses: businesses.recentlyAddedBusinesses,
      getRecentlyAddedBusinessesLoading:
        businesses.getRecentlyAddedBusinessesLoading,
      favoriteBusinesses: favorites.getFavoriteBusinesses,
    };
  });

  const navigateToReview = (id) => {
    navigation.navigate('Review', { id });
  };

  const isLogin = useSelector((state) => state.auth.isLogin);
  const [loading, setLoading] = useState(true);
  const deltaY = new Animated.Value(0);
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const getLocation = useLocation();
  let placeholderItems = [1, 2, 3, 4, 5, 6, 7, 8];
  let featuredCategories = useSelector((state) => state.categories.featured);
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
  const [banner] = useState(HomeBannerData);
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());

  const heightImageBanner = Utils.scaleWithPixel(225);
  const marginTopBanner = heightImageBanner - heightHeader + 10;

    useEffect(() => {
        VersionCheck.needUpdate()
            .then(async res => {
                if (res.isNeeded) {
                    Alert.alert('Update Required', 'Your application version is outdated, Click on Update Now to update it.', [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                        { text: 'Update Now', onPress: () => Linking.openURL(res.storeUrl) },
                    ], {
                        cancelable: false,
                    });
                }
            });
    }, []);

    useEffect(() => {
        checkNotifications().then(({status}) => {
            let message = Platform.OS === 'android'
                ? 'Open Settings > Manage Notifications > Allow notifications from Explore BTK'
                : 'Open Settings > Notifications > Allow notifications from Explore BTK';
            if (status === 'blocked') {
                Alert.alert('Allow Notifications', message, [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    { text: 'Open Settings', onPress: () => Linking.openSettings() },
                ], {
                    cancelable: false,
                });
            }
        });
    }, []);

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
    dispatch(getCategories({ limit: 7 }, null, true));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getCategories({}, () => {
        setLoading(false);
      }),
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

  const navigateBusinessDetail = (id) => {
    navigation.navigate('PlaceDetail', { id });
  };

  const seeMore = (payload = {}) => {
    if (payload.route === 'Category') {
      navigation.navigate('Category', {
        latitude: getLocation?.latitude ?? null,
        longitude: getLocation?.longitude ?? null,
      });
    } else {
      navigation.navigate('Place', payload);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always' }}>
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
                onPress={() => navigation.navigate('HelpLine')}>
                {t('help_line')}
              </Button>
            );
          }}
        />
        <ScrollView
          onScroll={Animated.event([
            {
              nativeEvent: {
                contentOffset: { y: deltaY },
              },
            },
          ])}
          onContentSizeChange={() => {
            setHeightHeader(Utils.heightHeader());
          }}
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
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Filter', {
                  home: true,
                  coordinates: {
                    latitude: getLocation?.latitude ?? null,
                    longitude: getLocation?.longitude ?? null,
                  },
                })
              }>
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
              numColumns={'4'}
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
              numColumns={'4'}
              keyExtractor={(item, index) => item.id}
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
          <SectionList
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
            renderItem={({ item, index }) => {
              return (
                <PlaceItem
                  grid
                  image={item?.thumbnail}
                  title={item.name}
                  subtitle={item.category}
                  location={item?.address}
                  rate={item?.averageRatings || 0.0}
                  isFavorite={stateProps?.favoriteBusinesses?.some(
                    (obj) => obj._id === item?._id,
                  )}
                  businessId={item?._id}
                  navigation={navigation}
                  lastRoute="Home"
                  // status='Open Now'
                  onPress={() => navigateBusinessDetail(item._id)}
                  onPressTag={() => navigateToReview(item._id)}
                  style={{ marginLeft: 15, width: 175 }}
                />
              );
            }}
          />
          {/* Recently Added Businesses Section */}
          <SectionList
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
            renderItem={({ item, index }) => {
              return (
                <CardList
                  key={index}
                  image={item?.thumbnail}
                  title={item.name}
                  subtitle={item.category}
                  rate={item?.averageRatings || 0.0}
                  style={{ marginBottom: 15 }}
                  onPress={() => navigateBusinessDetail(item._id)}
                  onPressTag={() => navigateToReview(item._id)}
                />
              );
            }}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
