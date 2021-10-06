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
  Placeholder,
  PlaceholderLine,
  Progressive,
  PlaceholderMedia,
} from 'rn-placeholder';
import {
  Header,
  Button,
  Text,
  Icon,
  SafeAreaView,
  CardList,
  PlaceItem,
  ListItem,
  Image,
} from '@components';
import { BaseColor, useTheme, BaseStyle } from '@config';
import * as Utils from '@utils';
import styles from './styles';
import { HomeBannerData } from '@data';
import FeaturedCategoryPlaceholderComponent from '../../components/Placeholders/featuredCategories';
import SectionList from './sectionList';
import { getCategories } from '../../actions/category';
import { getBusinesses, getSingleBusiness } from '../../actions/business';
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

  const navigateToReview = id => {
    navigation.navigate('Review', { id });
  };

  const isLogin = useSelector(state => state.auth.isLogin);
  const [loading, setLoading] = useState(true);
  const deltaY = new Animated.Value(0);
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const getLocation = useLocation();
  let placeholderItems = [1, 2, 3, 4, 5, 6, 7, 8];
  let featuredCategories = useSelector(state => state.categories.featured);
  featuredCategories = [
    ...featuredCategories,
    ...[
      {
        id: '5',
        color: BaseColor.kashmir,
        icon: 'ellipsis-h',
        name: 'More',
        route: 'Category',
      },
    ],
  ];
  const [banner] = useState(HomeBannerData);
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());

  const heightImageBanner = Utils.scaleWithPixel(225);
  const marginTopBanner = heightImageBanner - heightHeader + 10;

  useEffect(() => {
    VersionCheck.needUpdate().then(async res => {
      if (res.isNeeded) {
        Alert.alert(
          'Update Required',
          'Your application version is outdated, Click on Update Now to update it.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Update Now',
              onPress: () => Linking.openURL(res.storeUrl),
            },
          ],
          {
            cancelable: false,
          },
        );
      }
    });
  }, []);

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
        fields: 'name, thumbnail, category, address, averageRatings',
      }),
    );
  }, [dispatch]);

  const navigateBusinessDetail = id => {
    dispatch(getSingleBusiness(id));
    navigation.navigate('PlaceDetailNavigator', { id });
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

  const renderCategory = () => {
    let list = (
      <FlatList
        contentContainerStyle={{
          paddingLeft: 10,
          paddingRight: 20,
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={[1, 2, 3, 4, 5, 6]}
        keyExtractor={(item, index) => `Category ${index}`}
        renderItem={({ item, index }) => {
          return (
            <View>
              <Placeholder Animation={Progressive}>
                <View style={styles.categoryContent}>
                  <PlaceholderMedia style={styles.imageContent} />
                  <PlaceholderLine
                    style={{ width: 50, height: 8, marginTop: 10 }}
                  />
                </View>
              </Placeholder>
            </View>
          );
        }}
      />
    );
    if (featuredCategories?.length > 1) {
      list = (
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 10 }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={featuredCategories}
          keyExtractor={(item, index) => `Category ${index}`}
          renderItem={({ item, index }) => {
            return (
              <View>
                <TouchableOpacity
                  style={styles.categoryContent}
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
                      styles.imageContent,
                      { backgroundColor: item.color },
                    ]}>
                    <Icon
                      name={item.icon}
                      size={20}
                      color={BaseColor.whiteColor}
                      solid
                    />
                  </View>
                  <Text
                    footnote
                    numberOfLines={1}
                    style={{
                      marginTop: 10,
                    }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      );
    }

    return (
      <View>
        <Text title3 bold style={{ paddingHorizontal: 20, marginBottom: 5 }}>
          Explore by Category
        </Text>
        {list}
      </View>
    );
  };

  const renderPopular = () => {
    let list = (
      <FlatList
        contentContainerStyle={{ paddingLeft: 20 }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={[1, 2, 3, 4, 5, 6]}
        keyExtractor={(item, index) => `popular${index}`}
        renderItem={({ item, index }) => (
          <ListItem
            loading={true}
            grid
            style={{
              marginRight: 15,
              width: 200,
            }}
          />
        )}
      />
    );

    if (stateProps?.popularBusinesses?.length) {
      list = (
        <FlatList
          contentContainerStyle={{ paddingLeft: 5, paddingRight: 20 }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={stateProps.popularBusinesses}
          keyExtractor={(item, index) => `popular${index}`}
          renderItem={({ item, index }) => (
            <ListItem
              grid
              title={item?.name}
              subtitle={item?.description}
              image={item?.thumbnail}
              address={item?.address}
              rate={item?.averageRatings || 0.0}
              isFavorite={stateProps?.favoriteBusinesses?.some(
                obj => obj._id === item?._id,
              )}
              businessId={item?._id}
              navigation={navigation}
              lastRoute="Home"
              style={{
                marginLeft: 15,
                width: 200,
              }}
              onPress={() => navigateBusinessDetail(item._id)}
              onPressTag={() => navigateToReview(item._id)}
            />
          )}
        />
      );
    }

    return (
      <View>
        <View style={[styles.sectionHeader, { marginTop: 20 }]}>
          <View style={styles.sectionHeaderContent}>
            <Text title3 bold>
              Popular Businesses
            </Text>
            <Text body2 grayColor>
              Find the most viewed businesses
            </Text>
          </View>
          <TouchableOpacity
            style={styles.sectionHeaderButton}
            onPress={() =>
              seeMore({
                popular: true,
                title: 'Popular Businesses',
                latitude: getLocation?.latitude ?? null,
                longitude: getLocation?.longitude ?? null,
              })
            }>
            <Text semibold style={styles.sectionHeaderButtonText}>
              See More
            </Text>
            <Icon
              name="angle-double-right"
              style={styles.sectionHeaderButtonIcon}
            />
          </TouchableOpacity>
        </View>
        {list}
      </View>
    );
  };

  const renderRecentlyAdded = () => {
    let list = (
      <View style={{ paddingHorizontal: 20 }}>
        {[1, 2, 3, 4, 5].map((item, index) => {
          return (
            <ListItem
              key={`RecentLocation ${index}`}
              loading={true}
              list
              style={{ marginBottom: 15 }}
            />
          );
        })}
      </View>
    );

    if (stateProps?.recentlyAddedBusinesses?.length) {
      list = (
        <View style={{ paddingHorizontal: 20 }}>
          {stateProps.recentlyAddedBusinesses.map((item, index) => {
            return (
              <ListItem
                key={`RecentlyAdded ${index}`}
                list
                title={item.name}
                subtitle={item.category}
                image={item.thumbnail}
                rate={item?.averageRatings ?? 0.0}
                address={item.address}
                isFavorite={stateProps?.favoriteBusinesses?.some(
                  obj => obj._id === item?._id,
                )}
                businessId={item?._id}
                navigation={navigation}
                lastRoute="Home"
                style={{ marginBottom: 15 }}
                onPress={() => navigateBusinessDetail(item._id)}
                onPressTag={() => navigateToReview(item._id)}
              />
            );
          })}
        </View>
      );
    }

    return (
      <View>
        <View style={[styles.sectionHeader, { marginTop: 20 }]}>
          <View style={styles.sectionHeaderContent}>
            <Text title3 bold>
              Recently Added Businesses
            </Text>
            <Text body2 grayColor>
              Let's find what's new
            </Text>
          </View>
          <TouchableOpacity
            style={styles.sectionHeaderButton}
            onPress={() =>
              seeMore({
                recent: true,
                title: 'Recently Added Businesses',
                latitude: getLocation?.latitude ?? null,
                longitude: getLocation?.longitude ?? null,
              })
            }>
            <Text semibold style={styles.sectionHeaderButtonText}>
              See More
            </Text>
            <Icon
              name="angle-double-right"
              style={styles.sectionHeaderButtonIcon}
            />
          </TouchableOpacity>
        </View>
        {list}
      </View>
    );
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
          scrollEventThrottle={8}>
          <View
            style={[
              styles.searchForm,
              {
                marginTop: 10,
                marginBottom: 20,
                backgroundColor: colors.background,
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
          {renderCategory()}
          {renderPopular()}
          {renderRecentlyAdded()}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
