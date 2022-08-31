import React, { useState, useRef, useEffect } from 'react';
import {
  RefreshControl,
  View,
  Animated,
  Alert,
  StyleSheet,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Carousel from 'react-native-snap-carousel';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { StackScreenProps } from '@react-navigation/stack';

import { BaseStyle, BaseColor, useTheme } from '@config';
import * as Utils from '@utils';
import {
  Header,
  SafeAreaView,
  Icon,
  PlaceItem,
  FilterSort,
  CardList,
  Loading,
  Text,
} from '@components';

import { EVENTS, trackEvent } from '../../../userTracking';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';
import { useBusinesses } from '@screens/businesses/queries/queries';
import { BusinessPresentable } from '@screens/businesses/models/BusinessPresentable';

// interface Coordinates {
//   latitude: number;
//   longitude: number;
// }
// interface Payload {
//   popular?: boolean;
//   recent?: boolean;
//   category?: string;
//   search?: string;
//   tags?: string[];
//   facilities?: string[];
//   coordinates?: Coordinates;
//   latitude?: number;
//   longitude?: number;
//   limit: number;
//   skip: number;
//   // loading: boolean;
// }

export default function BusinessesScreen(
  props: StackScreenProps<GlobalParamList, 'Businesses'>,
) {
  const { navigation, route } = props;
  const dispatch = useDispatch();
  const [skip, setSkip] = useState(0);
  const [isSortLocation, setSortLocation] = useState(false);

  const user = useSelector((state: any) => state.profile);
  const { title, ...restParams } = route.params;
  const { isLoading, data: businesses } = useBusinesses(
    ['businesses', title],
    restParams,
  );

  const defaultRegion = {
    latitude: 37.763844,
    longitude: -122.414925,
  };

  // const getBusinesses = () => {
  //   let payload: Payload = {
  //     limit: 10,
  //     skip,
  //     // loading: true,
  //   };
  //   if (route.params.popular) {
  //     payload.popular = true;
  //   }
  //   if (route.params.recent) {
  //     payload.recent = true;
  //   }
  //   if (route.params.category) {
  //     payload.category = route.params.category;
  //   }
  //   // if (stateProps?.filteredData?.search) {
  //   //   payload.search = stateProps.filteredData.search;
  //   // }
  //   // if (stateProps?.filteredData?.category) {
  //   //   payload.category = stateProps.filteredData.category.map((e) => e.name);
  //   // }
  //   // if (stateProps?.filteredData?.tags) {
  //   //   payload.tags = stateProps.filteredData.tags.map((e) => e.name);
  //   // }
  //   // if (stateProps?.filteredData?.facilities) {
  //   //   payload.facilities = stateProps.filteredData.facilities.map(
  //   //     (e) => e.name,
  //   //   );
  //   // }
  //   if (isSortLocation) {
  //     payload.latitude = route.params.latitude!;
  //     payload.longitude = route.params.longitude!;
  //   }
  //   // dispatch(getAllBusinesses(payload));
  // };

  useEffect(() => {
    return () => {
      // dispatch({ type: 'CLEAR_ALL_BUSINESSES_API' });
      // dispatch(setFilteredData({}));
    };
  }, [dispatch]);

  // const stateProps = useSelector(({ businesses, favorites }) => {
  //   return {
  //     loading: businesses.getAllBusinessesLoading,
  //     data: businesses.allBusinesses,
  //     loadMoreLoading: businesses.getAllBusinessesLoadMoreLoading,
  //     isLoadMore: businesses.isLoadMore,
  //     favoriteBusinesses: favorites.getFavoriteBusinesses,
  //     filteredData: businesses.filteredData,
  //   };
  // });

  const { t } = useTranslation();
  const { colors } = useTheme();
  const scrollAnim = new Animated.Value(0);
  const offsetAnim = new Animated.Value(0);
  const clampedScroll = Animated.diffClamp(
    Animated.add(
      scrollAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolateLeft: 'clamp',
      }),
      offsetAnim,
    ),
    0,
    40,
  );

  const sliderRef = useRef(null);

  const viewportWidth = Utils.getWidthDevice();
  const [active, setActive] = useState(0);
  const [modeView, setModeView] = useState('grid');
  const [mapView, setMapView] = useState(false);
  const [region, setRegion] = useState({
    latitude: defaultRegion.latitude,
    longitude: defaultRegion.longitude,
    latitudeDelta: 0.009,
    longitudeDelta: 0.004,
  });

  /**
   * export viewport
   * @param {*} percentage
   * @returns
   */
  const getViewPort = (percentage: number) => {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
  };

  /**
   * call when on change sort
   */
  const onChangeSort = () => {};

  /**
   * @description Open modal when view mode is pressed
   * @author Passion UI <passionui.com>
   * @date 2019-09-01
   */
  const onChangeView = () => {
    Utils.enableExperimental();
    switch (modeView) {
      case 'grid':
        setModeView('list');
        break;
      case 'list':
        setModeView('block');
        break;
      case 'block':
        setModeView('grid');
        break;
      default:
        setModeView('grid');
        break;
    }
  };

  const onChangeMapView = () => {
    Utils.enableExperimental();
    setMapView(!mapView);
  };

  // const onSelectLocation = () => {
  //   // for (let index = 0; index < list.length; index++) {
  //   //   const element = list[index];
  //   //   if (
  //   //     element.region.latitude == location.latitude &&
  //   //     element.region.longitude == location.longitude
  //   //   ) {
  //   //     sliderRef.current.snapToItem(index);
  //   //     return;
  //   //   }
  //   // }
  // };

  const onSortLocation = () => {
    if (route?.params?.latitude && route?.params?.longitude) {
      setSkip(0);
      setSortLocation(!isSortLocation);
    } else {
      Alert.alert(
        'Location Access Required',
        'If you want to see Businesses near you. Go to your mobile Location settings and allow Explore BTK to access your location',
      );
    }
  };

  const navigateToSearchPage = () => {
    // let params = {
    //   popular: route?.params?.popular,
    //   recent: route?.params?.recent,
    //   category: route?.params?.category,
    //   categoryIcon: route?.params?.categoryIcon,
    // };
    // if (isSortLocation) {
    //   params.coordinates = {
    //     latitude: route?.params?.latitude,
    //     longitude: route?.params?.longitude,
    //   };
    //   params.locationSort = true;
    // }
    // navigation.navigate('Filter', { ...params });
  };

  const navigateBusinessDetail = ({
    _id: id,
    name,
    category,
  }: BusinessPresentable) => {
    navigation.navigate('BusinessDetailTabNavigator', { id });
    trackEvent(EVENTS.VISITED_BUSINESS, {
      id,
      name,
      category,
    });
  };

  const onScrollHandler = () => {
    // if (stateProps.loading || stateProps.isLoadMore) {
    //   return;
    // }
    // setSkip(stateProps.data.length);
  };
  const onRefreshHandler = () => {
    setSkip(0);
  };

  const renderFooter = () => {
    // if (businesses?.length && stateProps.loadMoreLoading) {
    //   return (
    //     <View style={styles.listFooter}>
    //       <ActivityIndicator size="large" color={BaseColor.blueColor} />
    //     </View>
    //   );
    // }
    return null;
  };

  const listEmptyComponent = () => {
    return (
      <View style={styles.sectionEmpty}>
        <Text semibold style={styles.sectionEmptyText}>
          {/*{stateProps?.filteredData?.search*/}
          {/*  ? 'No search results found, Try different keywords'*/}
          {/*  : `No ${route?.params?.title || t('place')} Available`}*/}
        </Text>
      </View>
    );
  };

  /**
   * @description Render container view
   * @author Passion UI <passionui.com>
   * @date 2019-09-01
   * @returns
   */
  const renderList = () => {
    const navbarTranslate = clampedScroll.interpolate({
      inputRange: [0, 40],
      outputRange: [0, -40],
      extrapolate: 'clamp',
    });
    switch (modeView) {
      case 'block':
        return (
          <View style={{ flex: 1 }}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
                flex: businesses?.length ? 0 : 1,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={false}
                  progressViewOffset={80}
                  onRefresh={() => onRefreshHandler()}
                />
              }
              onEndReached={onScrollHandler}
              // onEndThreshold={0.1}
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnim,
                      },
                    },
                  },
                ],
                { useNativeDriver: true },
              )}
              data={businesses}
              key={'block'}
              keyExtractor={(item) => item._id}
              ListEmptyComponent={listEmptyComponent}
              renderItem={({ item }) => (
                <PlaceItem
                  block
                  image={item.thumbnail}
                  title={item.name}
                  subtitle={item.category}
                  location={item.address}
                  phone={item.telephone}
                  rate={item.averageRatings}
                  status={item.status}
                  // rateStatus={item?.rateStatus}
                  numReviews={item?.reviews?.length}
                  // isFavorite={
                  //   !!item?.favorites?.find(
                  //     (favorite: any) => favorite.ownerId === user._id,
                  //   )
                  // }
                  businessId={item?._id}
                  navigation={navigation}
                  lastRoute={route.params.category ? 'Category' : 'Place'}
                  onPress={() => navigateBusinessDetail(item)}
                />
              )}
              ListFooterComponent={renderFooter}
            />
            <Animated.View
              style={[
                styles.navbar,
                { transform: [{ translateY: navbarTranslate }] },
              ]}>
              <FilterSort
                modeView={modeView}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onLocation={onSortLocation}
                isLocation={isSortLocation}
              />
            </Animated.View>
          </View>
        );
      case 'list':
        return (
          <View style={{ flex: 1 }}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
                paddingHorizontal: 20,
                flex: businesses?.length ? 0 : 1,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={false}
                  progressViewOffset={80}
                  onRefresh={() => onRefreshHandler()}
                />
              }
              onEndReached={onScrollHandler}
              // onEndThreshold={0.1}
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnim,
                      },
                    },
                  },
                ],
                { useNativeDriver: true },
              )}
              data={businesses}
              key={'list'}
              keyExtractor={(item) => item._id}
              ListFooterComponent={renderFooter}
              ListEmptyComponent={listEmptyComponent}
              renderItem={({ item }) => (
                <PlaceItem
                  list
                  image={item?.thumbnail}
                  title={item.name}
                  subtitle={item.category}
                  location={item.address}
                  phone={item.telephone}
                  rate={item.averageRatings}
                  status={item?.status}
                  // rateStatus={item?.rateStatus}
                  numReviews={item?.reviews?.length}
                  // isFavorite={
                  //   !!item?.favorites?.find(
                  //     (favorite: any) => favorite.ownerId === user._id,
                  //   )
                  // }
                  businessId={item?._id}
                  navigation={navigation}
                  lastRoute={route.params.category ? 'Category' : 'Place'}
                  style={{
                    marginBottom: 15,
                  }}
                  onPress={() => navigateBusinessDetail(item)}
                />
              )}
            />
            <Animated.View
              style={[
                styles.navbar,
                {
                  transform: [{ translateY: navbarTranslate }],
                },
              ]}>
              <FilterSort
                modeView={modeView}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onLocation={onSortLocation}
                isLocation={isSortLocation}
              />
            </Animated.View>
          </View>
        );
      default:
        return (
          <View style={{ flex: 1 }}>
            <Animated.FlatList
              contentContainerStyle={{
                paddingTop: 50,
                flex: businesses?.length ? 0 : 1,
              }}
              columnWrapperStyle={{
                paddingLeft: 5,
                paddingRight: 20,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={false}
                  progressViewOffset={80}
                  onRefresh={() => onRefreshHandler()}
                />
              }
              onEndReached={onScrollHandler}
              // onEndThreshold={0.1}
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        y: scrollAnim,
                      },
                    },
                  },
                ],
                { useNativeDriver: true },
              )}
              showsVerticalScrollIndicator={false}
              numColumns={2}
              data={businesses}
              key={'grid'}
              keyExtractor={(item) => item._id}
              ListFooterComponent={renderFooter}
              ListEmptyComponent={listEmptyComponent}
              renderItem={({ item }) => (
                <PlaceItem
                  grid
                  image={item.thumbnail}
                  title={item.name}
                  subtitle={item.category}
                  location={item.address}
                  phone={item.telephone}
                  rate={item.averageRatings}
                  status={item?.status}
                  // rateStatus={item.reviewStats.averageRatings}
                  numReviews={item?.reviews.length}
                  // isFavorite={
                  //   !!item?.favorites?.find(
                  //     (favorite: any) => favorite.ownerId === user._id,
                  //   )
                  // }
                  businessId={item?._id}
                  navigation={navigation}
                  lastRoute={route.params.category ? 'Category' : 'Place'}
                  style={{
                    marginLeft: 15,
                    marginBottom: 15,
                  }}
                  onPress={() => navigateBusinessDetail(item)}
                />
              )}
            />
            <Animated.View
              style={[
                styles.navbar,
                {
                  transform: [{ translateY: navbarTranslate }],
                },
              ]}>
              <FilterSort
                modeView={modeView}
                onChangeSort={onChangeSort}
                onChangeView={onChangeView}
                onLocation={onSortLocation}
                isLocation={isSortLocation}
              />
            </Animated.View>
          </View>
        );
    }
  };

  const renderMapView = () => {
    return (
      <View style={{ flex: 1 }}>
        <MapView provider={PROVIDER_GOOGLE} style={styles.map} region={region}>
          {businesses?.map((item, index) => {
            return (
              <Marker
                // onPress={(e) => onSelectLocation(e.nativeEvent.coordinate)}
                key={item._id}
                coordinate={{
                  latitude: item.location ? item.location.coordinates[0] : 0,
                  longitude: item.location ? item.location.coordinates[1] : 0,
                }}>
                <View
                  style={[
                    styles.iconLocation,
                    {
                      backgroundColor:
                        index == active ? colors.primary : BaseColor.whiteColor,
                      borderColor: colors.primary,
                    },
                  ]}>
                  <Icon
                    name="star"
                    size={16}
                    color={
                      index === -active ? BaseColor.whiteColor : colors.primary
                    }
                  />
                </View>
              </Marker>
            );
          })}
        </MapView>
        <View style={{ position: 'absolute', bottom: 0 }}>
          <Carousel
            ref={sliderRef}
            data={businesses || []}
            renderItem={({ item }) => (
              <CardList
                image={item?.thumbnail}
                title={item.name}
                subtitle={item.category}
                rate={item.averageRatings}
                style={{
                  margin: 3,
                  padding: 10,
                  backgroundColor: colors.card,
                  borderRadius: 8,
                  shadowColor: colors.border,
                  shadowOffset: {
                    width: 3,
                    height: 2,
                  },
                  shadowOpacity: 1,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
                onPress={() => navigateBusinessDetail(item)}
              />
            )}
            sliderWidth={viewportWidth}
            itemWidth={getViewPort(75) + getViewPort(2) * 2}
            firstItem={1}
            inactiveSlideScale={0.95}
            inactiveSlideOpacity={0.85}
            contentContainerCustomStyle={{ paddingVertical: 10 }}
            loop={true}
            loopClonesPerSide={2}
            autoplay={false}
            onSnapToItem={(index) => {
              setActive(index);
              if (businesses && businesses[index]) {
                const currentBusiness = businesses[index];
                if (currentBusiness.location) {
                  setRegion({
                    latitudeDelta: 0.009,
                    longitudeDelta: 0.004,
                    latitude: currentBusiness.location.coordinates[0],
                    longitude: currentBusiness.location.coordinates[1],
                  });
                }
              }
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={title || t('place')}
        renderLeft={() => {
          return (
            <Icon
              name="arrow-left"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        renderRight={() => {
          return (
            <Icon
              name={mapView ? 'align-right' : 'map'}
              size={20}
              color={colors.primary}
            />
          );
        }}
        renderRightSecond={() => {
          return <Icon name="search" size={20} color={colors.primary} />;
        }}
        onPressRightSecond={() => navigateToSearchPage()}
        onPressRight={() => {
          onChangeMapView();
        }}
      />
      <View style={{ position: 'relative', flex: 1 }}>
        {isLoading ? (
          <Loading loading={true} />
        ) : mapView ? (
          renderMapView()
        ) : (
          renderList()
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  navbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: BaseColor.whiteColor,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  iconLocation: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  followLocationIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BaseColor.whiteColor,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listFooter: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  sectionEmptyText: {
    textAlign: 'center',
  },
  sectionListContainer: {
    paddingLeft: 5,
    paddingRight: 15,
  },
});

[
  {
    _id: '5fe498295de14f426e059518',
    views: 1578,
    tags: ['Mineral Water'],
    name: 'Labbaik Drinking Water',
    description:
      'Enjoy healthy and fresh water in every sip. \n\nWe are using Merck Minrals which is number one in quality and purity.',
    telephone: '03151114778',
    established: '2018-11-24T13:21:13.000Z',
    category: 'Food',
    address: 'P10 A',
    location: {
      coordinates: [25.05889596297364, 67.31158457979701],
      _id: '6152501515629741c4ef83e5',
      type: 'Point',
    },
    openHours: [
      {
        _id: '607410b37d8d995081f4fe64',
        day: 'Monday',
        to: '05:00 pm',
        from: '09:00 am',
      },
      {
        _id: '607410b37d8d995081f4fe65',
        day: 'Tuesday',
        to: '05:00 pm',
        from: '09:00 am',
      },
      {
        _id: '607410b37d8d995081f4fe66',
        day: 'Wednesday',
        to: '05:00 pm',
        from: '09:00 am',
      },
      {
        _id: '607410b37d8d995081f4fe67',
        day: 'Thursday',
        to: '05:00 pm',
        from: '09:00 am',
      },
      {
        _id: '607410b37d8d995081f4fe68',
        day: 'Friday',
        to: '05:00 pm',
        from: '09:00 am',
      },
      {
        _id: '607410b37d8d995081f4fe69',
        day: 'Saturday',
        to: '05:00 pm',
        from: '09:00 am',
      },
    ],
    priceRange: {
      _id: '6152501515629741c4ef83e6',
      from: 'RS 100',
      to: 'RS 200',
    },
    thumbnail:
      'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/5fdd03d6ec31e556bb05ae2c/businesses//C3E9C95E-520D-4BB3-B092-BCD46D2B04DE.jpg',
    gallery: [
      {
        cover: false,
        _id: '5fe498295de14f426e059521',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/5fdd03d6ec31e556bb05ae2c/businesses//3921700F-5048-4843-AB2D-CDCD79387B00.jpg',
      },
      {
        cover: true,
        _id: '5fe498295de14f426e059522',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/5fdd03d6ec31e556bb05ae2c/businesses//C94A8115-577E-4E9F-B71C-E96B6452DBDA.jpg',
      },
    ],
    ownerId: '5fdd03d6ec31e556bb05ae2c',
    facilities: [{ name: 'Open 24/7', icon: 'clock' }],
    reviews: [
      {
        disable: false,
        _id: '5fe4c1a75de14f426e059557',
        title: 'Healthy and Freash 💦',
        description:
          'I am using their minral water form 7 months and their services and water quality is excellent.',
        rating: 5,
        owner: {
          _id: '5fdd03d6ec31e556bb05ae2c',
          name: 'Muhammad Furqan',
          avatar:
            'https://btk-explore-businesses.s3.ap-southeast-1.amazonaws.com/c69e1f74-f488-490a-9449-3a8639cefc5e-82FA6483-5B7E-471D-99DA-9D4266E44186.jpg',
        },
        updatedAt: '2020-12-24T16:28:23.228Z',
        createdAt: '2020-12-24T16:28:23.228Z',
      },
      {
        disable: false,
        _id: '5fec77531e2f7a7329946445',
        title: 'Ayaz Ali',
        description: 'Excellent service ..quality product',
        rating: 5,
        owner: { _id: '5fe85c925de14f426e05965f', name: 'Ayaz' },
        updatedAt: '2020-12-30T12:49:23.228Z',
        createdAt: '2020-12-30T12:49:23.228Z',
      },
      {
        disable: false,
        _id: '6256a31115629741c4f1199c',
        title: 'Very Good Drinking Water',
        description:
          'I tried Labbaik Water it is really Good & healthy as per someone recommend me. Highly recommend.',
        rating: 5,
        owner: { _id: '6238bbfd15629741c4f0e427', name: 'Shehmir' },
        updatedAt: '2022-04-19T15:47:53.711Z',
        createdAt: '2022-04-13T10:16:49.765Z',
      },
    ],
    createdAt: '2020-12-24T13:31:21.534Z',
    updatedAt: '2022-08-28T15:28:44.690Z',
    __v: 0,
    favorites: 5,
    status: 'VERIFIED',
    averageRatings: 5,
  },
  {
    _id: '62a86fe78c83fd0d544ff73f',
    status: 'PENDING',
    views: 549,
    tags: ['BBQ', 'Broast', 'Chicken', 'Dish', 'Food'],
    name: 'Jashan by Ginsoy',
    description:
      'Indulge in the most Authentic and Luxurious Desi Cuisine of Pakistan.\nThe Ultimate Desi Experience.',
    telephone: '0334992170-4',
    website: 'http://www.jashan.pk',
    email: 'info@jashan.pk',
    established: '2022-06-03T19:00:30.547Z',
    category: 'Food',
    facilities: [{ name: 'Open 24/7', icon: 'clock' }],
    address: 'Bahria Town Karachi near Danzoo.',
    location: {
      coordinates: [25.033234875260668, 67.31716152280569],
      _id: '62a870cf8c83fd0d544ff7b5',
      type: 'Point',
    },
    openHours: [
      {
        _id: '62a870cf8c83fd0d544ff7b6',
        day: 'Monday',
        to: '12:30 am',
        from: '12:00 pm',
      },
      {
        _id: '62a870cf8c83fd0d544ff7b7',
        day: 'Tuesday',
        to: '12:30 am',
        from: '12:00 pm',
      },
      {
        _id: '62a870cf8c83fd0d544ff7b8',
        day: 'Wednesday',
        to: '12:30 am',
        from: '12:00 pm',
      },
      {
        _id: '62a870cf8c83fd0d544ff7b9',
        day: 'Thursday',
        to: '12:30 am',
        from: '12:00 pm',
      },
      {
        _id: '62a870cf8c83fd0d544ff7ba',
        day: 'Friday',
        to: '12:30 am',
        from: '12:00 pm',
      },
      {
        _id: '62a870cf8c83fd0d544ff7bb',
        day: 'Saturday',
        to: '12:30 am',
        from: '07:30 am',
      },
      {
        _id: '62a870cf8c83fd0d544ff7bc',
        day: 'Sunday',
        to: '12:30 am',
        from: '07:30 am',
      },
    ],
    priceRange: {
      _id: '62a870cf8c83fd0d544ff7bd',
      from: 'RS 500',
      to: 'RS 20000',
    },
    gallery: [
      {
        cover: true,
        _id: '62a86fe78c83fd0d544ff749',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/628fa19615629741c4f17bc1/businesses//660b7cbc-dff8-4a4d-a9ec-f329abfb6df9.jpg',
      },
      {
        cover: false,
        _id: '62a86fe78c83fd0d544ff74a',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/628fa19615629741c4f17bc1/businesses//jashan-1.jpg.png',
      },
      {
        cover: false,
        _id: '62a86fe78c83fd0d544ff74b',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/628fa19615629741c4f17bc1/businesses//jashan-2.png',
      },
      {
        cover: false,
        _id: '62a86fe78c83fd0d544ff74c',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/628fa19615629741c4f17bc1/businesses//jashan-4.png',
      },
      {
        cover: false,
        _id: '62a86fe78c83fd0d544ff74d',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/628fa19615629741c4f17bc1/businesses//jashan-3.png',
      },
      {
        cover: false,
        _id: '62a86fe78c83fd0d544ff74e',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/628fa19615629741c4f17bc1/businesses//jashan-.png',
      },
    ],
    thumbnail:
      'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/628fa19615629741c4f17bc1/businesses//76a7dc31-a05e-422e-a41e-aa6ecfcaaa80.jpg',
    ownerId: '628fa19615629741c4f17bc1',
    reviews: [
      {
        disable: false,
        _id: '62a9b7798c83fd0d545002d4',
        title: 'Greate Experience',
        description:
          'Yesterday night I visited & ate Madfoon, It was delicious just needs little improvement, overall Greate experience.',
        rating: 5,
        owner: { _id: '6105868aa1d66524b92b99ba', name: 'Shahmir Hussain' },
        updatedAt: '2022-06-15T10:42:01.802Z',
        createdAt: '2022-06-15T10:42:01.802Z',
      },
    ],
    favorites: 1,
    createdAt: '2022-06-14T11:24:23.719Z',
    updatedAt: '2022-08-28T12:24:01.848Z',
    __v: 0,
    averageRatings: 5,
  },
  {
    _id: '5fe603f15de14f426e0595de',
    views: 506,
    tags: [
      'Burger',
      'Broast',
      'Casual Dining',
      'Fast Food',
      'Food',
      'Fries',
      'Outing',
      'Soft Drink',
    ],
    name: 'Burgrill',
    description:
      'From gourmet grilled Burgers to your all time favorite Wraps, subwich and salad, we offer you fulfilling meals. Prepared with the help of skilled chefs, our Fast Food selections will definitely fulfill your cravings! Order Now for home delivery or takeaway, and experience true expertise of the culinary world.',
    telephone: '0310-1156538',
    email: 'burgrillfood@gmail.con',
    established: null,
    category: 'Food',
    address:
      'Shop No. 1, Building 223, Midway Tower-1, Midway Commercial-B, Near Masjid-e-Sarwar, Bahria Town, Karachi.',
    location: {
      coordinates: [25.030196418846515, 67.30830520391463],
      _id: '602ad6ac0bad35480095db6c',
      type: 'Point',
    },
    openHours: [
      {
        _id: '602ad6ac0bad35480095db6d',
        day: 'Monday',
        to: '12:00 am',
        from: '12:00 pm',
      },
      {
        _id: '602ad6ac0bad35480095db6e',
        day: 'Tuesday',
        to: '12:00 am',
        from: '12:00 pm',
      },
      {
        _id: '602ad6ac0bad35480095db6f',
        day: 'Wednesday',
        to: '12:00 am',
        from: '12:00 pm',
      },
      {
        _id: '602ad6ac0bad35480095db70',
        day: 'Thursday',
        to: '12:00 am',
        from: '12:00 pm',
      },
      {
        _id: '602ad6ac0bad35480095db71',
        day: 'Friday',
        to: '12:00 am',
        from: '12:00 pm',
      },
      {
        _id: '602ad6ac0bad35480095db72',
        day: 'Saturday',
        to: '12:00 am',
        from: '12:00 pm',
      },
      {
        _id: '602ad6ac0bad35480095db73',
        day: 'Sunday',
        to: '12:00 am',
        from: '12:00 pm',
      },
    ],
    priceRange: {
      _id: '602ad6ac0bad35480095db74',
      from: 'RS 250',
      to: 'RS 1250',
    },
    gallery: [
      {
        cover: true,
        _id: '5fe603f15de14f426e0595e8',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/5fe0afc7ec31e556bb05ae5a/businesses//burgrill-cover.png',
      },
    ],
    thumbnail:
      'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/5fe0afc7ec31e556bb05ae5a/businesses//19edb45e-08ba-46c8-8a38-53b3fa01b1f1.jpg',
    ownerId: '5fe0afc7ec31e556bb05ae5a',
    facilities: [],
    reviews: [
      {
        disable: false,
        _id: '5fecaa56bab8645c3db508f9',
        title: 'Great Taste ',
        description:
          ' well done meat, perfect taste, reasonable prices\nAll & all very friendly good and quick service. ',
        rating: 5,
        owner: { _id: '5feca901bab8645c3db508eb', name: 'Fahim Shahjee' },
        updatedAt: '2020-12-30T16:27:02.532Z',
        createdAt: '2020-12-30T16:27:02.532Z',
      },
    ],
    createdAt: '2020-12-25T15:23:29.688Z',
    updatedAt: '2022-08-23T20:36:37.292Z',
    __v: 0,
    favorites: 1,
    averageRatings: 5,
  },
  {
    _id: '60bc03f17d8d995081f4ff61',
    status: 'PENDING',
    views: 332,
    tags: [
      'Beverages',
      'Burger',
      'Cafe',
      'Casual Dining',
      'Fast Food',
      'Food',
      'Fries',
      'Soft Drink',
    ],
    name: 'The Sauce Burger Cafe (Midway Commercial A)',
    description:
      'The wait is over! Our all new Bahria Town outlet, located at Midway Commercial A, is NOW OPEN and all set to serve you the #WondersOfTheSauce.\n\nRing us for delivery at: 11 11 72823 (SAUCE) | 0344 3006373 (Bahria Exclusive).',
    telephone: '03443006373',
    established: null,
    category: 'Food',
    facilities: [],
    address:
      'Shop #04, Plot# 118, 119, 120, Midway Commercial A, Opposite Malik Square,Bahria Town, Karachi.',
    location: {
      coordinates: [25.023093027141368, 67.30383630841969],
      _id: '60bc03f17d8d995081f4ff62',
      type: 'Point',
    },
    openHours: [
      {
        _id: '60bc03f17d8d995081f4ff63',
        day: 'Monday',
        to: '08:00 pm',
        from: '10:00 am',
      },
      {
        _id: '60bc03f17d8d995081f4ff64',
        day: 'Tuesday',
        to: '08:00 pm',
        from: '10:00 am',
      },
      {
        _id: '60bc03f17d8d995081f4ff65',
        day: 'Wednesday',
        to: '08:00 pm',
        from: '10:00 am',
      },
      {
        _id: '60bc03f17d8d995081f4ff66',
        day: 'Thursday',
        to: '08:00 pm',
        from: '10:00 am',
      },
      {
        _id: '60bc03f17d8d995081f4ff67',
        day: 'Friday',
        to: '08:00 pm',
        from: '10:00 am',
      },
      {
        _id: '60bc03f17d8d995081f4ff68',
        day: 'Saturday',
        to: '08:00 pm',
        from: '10:00 am',
      },
      {
        _id: '60bc03f17d8d995081f4ff69',
        day: 'Sunday',
        to: '08:00 pm',
        from: '10:00 am',
      },
    ],
    gallery: [
      {
        cover: true,
        _id: '60bc03f17d8d995081f4ff6a',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/5fe0afc7ec31e556bb05ae5a/businesses//the-sauce-burger-cafe-cover.png',
      },
    ],
    thumbnail:
      'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/5fe0afc7ec31e556bb05ae5a/businesses//a31678ab-804e-4023-af08-819780c04b78.jpg',
    ownerId: '5fe0afc7ec31e556bb05ae5a',
    reviews: [
      {
        disable: false,
        _id: '6133839fa1d66524b92b9aac',
        title: 'Thumbs up! ',
        description:
          'Great taste and value for money. Same quality as original SMCHS branch. Double beef burger was worth it.',
        rating: 5,
        owner: { _id: '61113180a1d66524b92b99f2', name: 'Mahmood Anwar' },
        updatedAt: '2021-09-04T14:33:03.271Z',
        createdAt: '2021-09-04T14:33:03.271Z',
      },
    ],
    favorites: 2,
    createdAt: '2021-06-05T23:08:33.616Z',
    updatedAt: '2022-08-22T14:52:41.628Z',
    __v: 0,
    averageRatings: 5,
  },
  {
    _id: '5ff0351abab8645c3db50b2a',
    status: 'PENDING',
    views: 148,
    tags: [],
    name: 'burgrillfood',
    description: '',
    telephone: '03101156530',
    email: 'faisalkfg@gmail.com',
    established: '2020-10-01T08:39:18.874Z',
    category: 'Food',
    address: 'midway b commercial building no 233',
    location: {
      coordinates: [24.9116241, 67.1043088],
      _id: '5ff0351abab8645c3db50b2b',
      type: 'Point',
    },
    openHours: [
      {
        _id: '5ff0351abab8645c3db50b2c',
        day: 'Monday',
        to: '12:00 pm',
        from: '12:00 am',
      },
      {
        _id: '5ff0351abab8645c3db50b2d',
        day: 'Tuesday',
        to: '12:00 pm',
        from: '12:00 am',
      },
      {
        _id: '5ff0351abab8645c3db50b2e',
        day: 'Wednesday',
        to: '12:00 pm',
        from: '12:00 am',
      },
      {
        _id: '5ff0351abab8645c3db50b2f',
        day: 'Thursday',
        to: '12:00 pm',
        from: '12:00 am',
      },
      {
        _id: '5ff0351abab8645c3db50b30',
        day: 'Friday',
        to: '12:00 pm',
        from: '12:00 am',
      },
      {
        _id: '5ff0351abab8645c3db50b31',
        day: 'Saturday',
        to: '12:00 pm',
        from: '12:00 am',
      },
      {
        _id: '5ff0351abab8645c3db50b32',
        day: 'Sunday',
        to: '12:00 pm',
        from: '12:00 am',
      },
    ],
    priceRange: {
      _id: '5ff0351abab8645c3db50b33',
      from: 'RS 200',
      to: 'RS 800',
    },
    gallery: [],
    thumbnail:
      'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/5ff033bebab8645c3db50b22/businesses//c8d9ea04-9426-4f17-8ade-ccffc281319f.jpg',
    ownerId: '5ff033bebab8645c3db50b22',
    facilities: [],
    reviews: [
      {
        disable: false,
        _id: '5ff03588bab8645c3db50b35',
        title: 'nice 👍',
        description: '',
        rating: 5,
        owner: { _id: '5ff033bebab8645c3db50b22', name: 'Faisal' },
        updatedAt: '2021-01-02T08:57:44.368Z',
        createdAt: '2021-01-02T08:57:44.368Z',
      },
    ],
    createdAt: '2021-01-02T08:55:54.946Z',
    updatedAt: '2022-08-29T06:45:57.602Z',
    __v: 0,
    averageRatings: 5,
    favorites: 0,
  },
  {
    _id: '62a9ade18c83fd0d54500223',
    status: 'PENDING',
    views: 119,
    tags: ['Food', 'BBQ'],
    name: 'Hot-N-Spicy',
    description:
      'Rebowned for our rolls & chutney, Hot N Spicy also specializes in a variety of cousins from Chinese to continental.',
    telephone: '021111223334',
    email: 'marketing@hotnspicy.com',
    established: '2021-12-31T19:00:37.312Z',
    category: 'Food',
    facilities: [{ name: 'Open 24/7', icon: 'clock' }],
    address: 'Midway Commercial Bahria Town Karachi',
    location: {
      coordinates: [25.029835213614863, 67.30789013206957],
      _id: '62a9ade18c83fd0d54500224',
      type: 'Point',
    },
    openHours: [
      {
        _id: '62a9ade18c83fd0d54500225',
        day: 'Monday',
        to: '12:00 am',
        from: '09:00 am',
      },
      {
        _id: '62a9ade18c83fd0d54500226',
        day: 'Tuesday',
        to: '12:00 am',
        from: '09:00 am',
      },
      {
        _id: '62a9ade18c83fd0d54500227',
        day: 'Wednesday',
        to: '12:00 am',
        from: '09:00 am',
      },
      {
        _id: '62a9ade18c83fd0d54500228',
        day: 'Thursday',
        to: '12:00 am',
        from: '09:00 am',
      },
      {
        _id: '62a9ade18c83fd0d54500229',
        day: 'Friday',
        to: '12:00 am',
        from: '09:00 am',
      },
      {
        _id: '62a9ade18c83fd0d5450022a',
        day: 'Saturday',
        to: '12:00 am',
        from: '09:00 am',
      },
      {
        _id: '62a9ade18c83fd0d5450022b',
        day: 'Sunday',
        to: '12:00 am',
        from: '09:00 am',
      },
    ],
    priceRange: {
      _id: '62a9ade18c83fd0d5450022c',
      from: 'RS 500',
      to: 'RS 15000',
    },
    gallery: [
      {
        cover: true,
        _id: '62a9ade18c83fd0d5450022d',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/6105868aa1d66524b92b99ba/businesses//HNS-Cover.png',
      },
      {
        cover: false,
        _id: '62a9ade18c83fd0d5450022e',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/6105868aa1d66524b92b99ba/businesses//HNS-post2.png',
      },
      {
        cover: false,
        _id: '62a9ade18c83fd0d5450022f',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/6105868aa1d66524b92b99ba/businesses//HNS-post5.png',
      },
      {
        cover: false,
        _id: '62a9ade18c83fd0d54500230',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/6105868aa1d66524b92b99ba/businesses//HNS-post4.png',
      },
      {
        cover: false,
        _id: '62a9ade18c83fd0d54500231',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/6105868aa1d66524b92b99ba/businesses//HNS-post3.png',
      },
      {
        cover: false,
        _id: '62a9ade18c83fd0d54500232',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/6105868aa1d66524b92b99ba/businesses//HNS-post1.png',
      },
    ],
    thumbnail:
      'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/6105868aa1d66524b92b99ba/businesses//50142b1b-cda9-47d5-bbb3-c3c0fe791025.jpg',
    ownerId: '6105868aa1d66524b92b99ba',
    reviews: [
      {
        disable: false,
        _id: '62e6e51a8c83fd0d54506d32',
        title: 'Awesome ambiance and food',
        description:
          'Green tikka is amazing\nchicken mughlai makhni handi is a must try!!\nfood is always fresh\ntheir service is also really good\nstaff is friendly!',
        rating: 5,
        owner: { _id: '62e6e4b48c83fd0d54506d2a', name: 'Sikendar Razak' },
        updatedAt: '2022-07-31T20:24:58.749Z',
        createdAt: '2022-07-31T20:24:58.749Z',
      },
    ],
    favorites: 1,
    createdAt: '2022-06-15T10:01:05.948Z',
    updatedAt: '2022-08-29T06:44:51.280Z',
    __v: 0,
    averageRatings: 5,
  },
  {
    _id: '5fe4a0bd5de14f426e059528',
    views: 3060,
    tags: ['Food', 'Cafe', 'Cakes'],
    name: 'Mev Bakes',
    description:
      'Pizza\nPasta\nBurgers\nSandwiches\nBaked Rolls\nFries\nWings\nNuggets\nChicken Strips',
    telephone: '03083338555',
    website: 'http://www.mevbakes.com',
    email: 'mevish.shahzad@gmail.com',
    established: '2020-08-01T13:42:45.000Z',
    category: 'Food',
    address: 'Midway commercial ',
    location: {
      coordinates: [25.029935464122158, 67.30790555477142],
      _id: '62e01e948c83fd0d54506399',
      type: 'Point',
    },
    openHours: [
      {
        _id: '62e01e948c83fd0d5450639a',
        day: 'Monday',
        to: '11:55 pm',
        from: '12:00 pm',
      },
      {
        _id: '62e01e948c83fd0d5450639b',
        day: 'Tuesday',
        to: '11:55 pm',
        from: '12:00 pm',
      },
      {
        _id: '62e01e948c83fd0d5450639c',
        day: 'Wednesday',
        to: '11:56 pm',
        from: '12:00 pm',
      },
      {
        _id: '62e01e948c83fd0d5450639d',
        day: 'Thursday',
        to: '11:55 pm',
        from: '12:00 pm',
      },
      {
        _id: '62e01e948c83fd0d5450639e',
        day: 'Saturday',
        to: '11:56 pm',
        from: '12:00 pm',
      },
      {
        _id: '62e01e948c83fd0d5450639f',
        day: 'Sunday',
        to: '11:56 pm',
        from: '12:00 pm',
      },
      {
        _id: '62e01e948c83fd0d545063a0',
        day: 'Friday',
        to: '11:55 pm',
        from: '12:00 pm',
      },
    ],
    priceRange: { _id: '62e01e948c83fd0d545063a1', from: 'RS', to: 'RS' },
    thumbnail:
      'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/5fdd03d6ec31e556bb05ae2c/businesses//968F4F6C-30EC-4956-A454-E0307E736892.jpg',
    gallery: [
      {
        cover: true,
        _id: '5fe4a0bd5de14f426e059531',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/5fdd03d6ec31e556bb05ae2c/businesses//5A5FFA0F-7B70-4E67-A191-4ADEA1C55BAE.jpg',
      },
      {
        cover: false,
        _id: '5fe4a0bd5de14f426e059532',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/5fdd03d6ec31e556bb05ae2c/businesses//57EF2B68-BB98-41D5-85B8-72CD0030C5D2.jpg',
      },
      {
        cover: false,
        _id: '5fe4a0bd5de14f426e059533',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/5fdd03d6ec31e556bb05ae2c/businesses//7C3164AA-0313-4E20-A632-671AC939D30C.jpg',
      },
    ],
    ownerId: '62dc05118c83fd0d54505b74',
    facilities: [{ name: 'Free Wifi', icon: 'wifi' }],
    reviews: [
      {
        disable: false,
        _id: '5fe4c0aa5de14f426e059555',
        title: 'They offer delicuous Pizza',
        description:
          'I have tried their Pizza and Fries and now i always order them from here.',
        rating: 5,
        owner: {
          _id: '5fdd03d6ec31e556bb05ae2c',
          name: 'Muhammad Furqan',
          avatar:
            'https://btk-explore-businesses.s3.ap-southeast-1.amazonaws.com/c69e1f74-f488-490a-9449-3a8639cefc5e-82FA6483-5B7E-471D-99DA-9D4266E44186.jpg',
        },
        updatedAt: '2020-12-24T16:24:10.124Z',
        createdAt: '2020-12-24T16:24:10.124Z',
      },
      {
        disable: false,
        _id: '625eda1315629741c4f13277',
        title: 'Delicious Fries 🍟',
        description: 'Your Fries 🍟 are truly delicious.',
        rating: 4.5,
        owner: { _id: '6238bbfd15629741c4f0e427', name: 'Shehmir' },
        updatedAt: '2022-04-19T15:49:39.284Z',
        createdAt: '2022-04-19T15:49:39.284Z',
      },
    ],
    createdAt: '2020-12-24T14:07:57.585Z',
    updatedAt: '2022-08-29T10:24:56.301Z',
    __v: 0,
    favorites: 4,
    shop: {
      status: 'enabled',
      shopId: 'cmVhY3Rpb24vc2hvcDpGN2ZrM3plR3o4anpXaWZzQQ==',
    },
    type: 'restaurant',
    status: 'VERIFIED',
    averageRatings: 4.75,
  },
  {
    _id: '5fecd335bab8645c3db5096f',
    status: 'PENDING',
    views: 239,
    tags: [],
    name: 'Saafa Premium Drinking Water',
    description: 'Pure and clean Drinking water',
    telephone: '03092117800',
    email: 'SAAFA.WATER@gmail.com',
    established: null,
    category: 'Food',
    address: 'Gadap Town Main Super Highway Karachi ',
    location: {
      coordinates: [25.0087229, 67.3056556],
      _id: '5fecd335bab8645c3db50970',
      type: 'Point',
    },
    openHours: [
      {
        _id: '5fecd335bab8645c3db50971',
        day: 'Monday',
        to: '09:00 am',
        from: '09:00 am',
      },
      {
        _id: '5fecd335bab8645c3db50972',
        day: 'Tuesday',
        to: '09:00 am',
        from: '09:00 am',
      },
      {
        _id: '5fecd335bab8645c3db50973',
        day: 'Wednesday',
        to: '09:00 am',
        from: '09:00 am',
      },
      {
        _id: '5fecd335bab8645c3db50974',
        day: 'Thursday',
        to: '09:00 am',
        from: '09:00 am',
      },
      {
        _id: '5fecd335bab8645c3db50975',
        day: 'Friday',
        to: '09:00 am',
        from: '09:00 am',
      },
      {
        _id: '5fecd335bab8645c3db50976',
        day: 'Saturday',
        to: '09:00 am',
        from: '09:00 am',
      },
      {
        _id: '5fecd335bab8645c3db50977',
        day: 'Sunday',
        to: '02:00 am',
        from: '12:30 am',
      },
    ],
    priceRange: { _id: '5fecd335bab8645c3db50978', from: 'RS' },
    gallery: [],
    thumbnail:
      'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/5fec91361e2f7a73299464cc/businesses//ba6504da-0e07-4485-82a9-ca1a6c5ac6a9.jpg',
    ownerId: '5fec91361e2f7a73299464cc',
    facilities: [],
    reviews: [
      {
        disable: false,
        _id: '5fecd3b1bab8645c3db5097b',
        title: 'Best Delivery ',
        description: '',
        rating: 5,
        owner: { _id: '5fec91361e2f7a73299464cc', name: '786 Drinking Water' },
        updatedAt: '2020-12-30T19:23:29.003Z',
        createdAt: '2020-12-30T19:23:29.003Z',
      },
      {
        disable: false,
        _id: '5fecd529bab8645c3db50988',
        title: 'Good Service 👍👍',
        description: '',
        rating: 5,
        owner: { _id: '5fecd4c9bab8645c3db5097c', name: 'میاں محمد یوسف' },
        updatedAt: '2020-12-30T19:29:45.521Z',
        createdAt: '2020-12-30T19:29:45.521Z',
      },
      {
        disable: false,
        _id: '6260225d15629741c4f13928',
        title: 'Average Drinking water',
        description:
          'Average Drinking Water, needs improvement in quality & delivery.',
        rating: 3,
        owner: { _id: '6238bbfd15629741c4f0e427', name: 'Shehmir' },
        updatedAt: '2022-04-20T15:10:21.249Z',
        createdAt: '2022-04-20T15:10:21.249Z',
      },
    ],
    createdAt: '2020-12-30T19:21:25.659Z',
    updatedAt: '2022-08-25T15:08:41.532Z',
    __v: 0,
    favorites: 1,
    averageRatings: 4.333333333333333,
  },
  {
    _id: '5fe4af585de14f426e05953a',
    views: 257,
    tags: [
      'BBQ',
      'Broast',
      'Burger',
      'Casual Dining',
      'Fast Food',
      'Food',
      'Fries',
      'Roll',
      'Soft Drink',
    ],
    name: 'BTOWN',
    description:
      "We only use the highest quality ingredients.\nthe result is a taste you can swear by.\n\nWe make real food by hand, fresh to order.\nit's not the fastest way-it's the right way.",
    telephone: '03171700107',
    website: 'https://btownburgers.pk',
    email: 'order@btownburgers.pk',
    established: '2020-12-01T14:08:00.618Z',
    category: 'Food',
    address: '226 , Midway Commercial B , Bahria Town Karachi',
    location: {
      coordinates: [25.029638965414946, 67.30939719825983],
      _id: '60472a36f1955656c30f9d52',
      type: 'Point',
    },
    openHours: [
      {
        _id: '60472a36f1955656c30f9d53',
        day: 'Monday',
        to: '01:00 am',
        from: '11:00 am',
      },
      {
        _id: '60472a36f1955656c30f9d54',
        day: 'Tuesday',
        to: '01:00 am',
        from: '11:00 am',
      },
      {
        _id: '60472a36f1955656c30f9d55',
        day: 'Wednesday',
        to: '01:00 am',
        from: '11:00 am',
      },
      {
        _id: '60472a36f1955656c30f9d56',
        day: 'Thursday',
        to: '01:00 am',
        from: '11:00 am',
      },
      {
        _id: '60472a36f1955656c30f9d57',
        day: 'Friday',
        to: '01:00 am',
        from: '11:00 am',
      },
      {
        _id: '60472a36f1955656c30f9d58',
        day: 'Saturday',
        to: '02:00 am',
        from: '12:00 pm',
      },
      {
        _id: '60472a36f1955656c30f9d59',
        day: 'Sunday',
        to: '02:00 am',
        from: '12:00 pm',
      },
    ],
    priceRange: {
      _id: '60472a36f1955656c30f9d5a',
      from: 'RS 250',
      to: 'RS 2500',
    },
    thumbnail:
      'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/5fe0afc7ec31e556bb05ae5a/businesses//3217a010-8be5-4e3d-b407-8707194aeba8.jpg',
    gallery: [
      {
        cover: true,
        _id: '5fe4af585de14f426e059544',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/5fe0afc7ec31e556bb05ae5a/businesses//4eb98e28-fec1-4d8c-9fe0-e7575183d855.jpg',
      },
    ],
    ownerId: '5fe0afc7ec31e556bb05ae5a',
    facilities: [],
    reviews: [
      {
        disable: false,
        _id: '5fe4b3cd5de14f426e059546',
        title: 'Its the best place for burgers in Bahria Town',
        description:
          'I have tried their Chicken Crisper and the taste was amazing 👌',
        rating: 5,
        owner: {
          _id: '5fdd03d6ec31e556bb05ae2c',
          name: 'Muhammad Furqan',
          avatar:
            'https://btk-explore-businesses.s3.ap-southeast-1.amazonaws.com/c69e1f74-f488-490a-9449-3a8639cefc5e-82FA6483-5B7E-471D-99DA-9D4266E44186.jpg',
        },
        updatedAt: '2020-12-24T15:29:17.978Z',
        createdAt: '2020-12-24T15:29:17.978Z',
      },
      {
        disable: false,
        _id: '61139da2a1d66524b92b99f4',
        title: 'Poor experience ',
        description:
          'Pricy burgers with average taste.\nTried beef burgers and a portion of meat was raw so it spoiled the whole experience.',
        rating: 3,
        owner: { _id: '61113180a1d66524b92b99f2', name: 'Mahmood Anwar' },
        updatedAt: '2021-08-11T09:51:30.616Z',
        createdAt: '2021-08-11T09:51:30.616Z',
      },
    ],
    createdAt: '2020-12-24T15:10:16.624Z',
    updatedAt: '2022-08-14T07:56:45.299Z',
    __v: 0,
    favorites: 1,
    averageRatings: 4,
  },
  {
    _id: '62d169bb8c83fd0d54504dbb',
    status: 'PENDING',
    views: 359,
    tags: ['Pizza', 'Burger', 'Soft Drink'],
    name: 'BROADWAY',
    description:
      'An award winning International Pizza chain with 50+ outlets Nationwide in Pakistan.',
    telephone: '03320339339',
    website: 'http://www.broadwaypizza.com.pk',
    email: 'info@broadwaypizza.com',
    established: '2021-12-31T19:00:22.552Z',
    category: 'Food',
    facilities: [
      { name: 'Open 24/7', icon: 'clock' },
      { name: 'Free Wifi', icon: 'wifi' },
    ],
    address: 'Midway commercial Bahria Town Karachi ',
    location: {
      coordinates: [25.020688073462516, 67.31444142758846],
      _id: '62d169bb8c83fd0d54504dbc',
      type: 'Point',
    },
    openHours: [
      {
        _id: '62d169bb8c83fd0d54504dbd',
        day: 'Monday',
        to: '05:00 pm',
        from: '09:00 am',
      },
      {
        _id: '62d169bb8c83fd0d54504dbe',
        day: 'Tuesday',
        to: '05:00 pm',
        from: '09:00 am',
      },
      {
        _id: '62d169bb8c83fd0d54504dbf',
        day: 'Wednesday',
        to: '05:00 pm',
        from: '09:00 am',
      },
      {
        _id: '62d169bb8c83fd0d54504dc0',
        day: 'Thursday',
        to: '05:00 pm',
        from: '09:00 am',
      },
      {
        _id: '62d169bb8c83fd0d54504dc1',
        day: 'Friday',
        to: '05:00 pm',
        from: '09:00 am',
      },
      {
        _id: '62d169bb8c83fd0d54504dc2',
        day: 'Saturday',
        to: '05:00 pm',
        from: '09:00 am',
      },
      {
        _id: '62d169bb8c83fd0d54504dc3',
        day: 'Sunday',
        to: '05:00 pm',
        from: '09:00 am',
      },
    ],
    priceRange: {
      _id: '62d169bb8c83fd0d54504dc4',
      from: 'RS 500',
      to: 'RS 5000',
    },
    gallery: [
      {
        cover: true,
        _id: '62d169bb8c83fd0d54504dc5',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/6105868aa1d66524b92b99ba/businesses//ae43c060-10ed-4c12-8895-c6bc0e6efa69.jpg',
      },
      {
        cover: false,
        _id: '62d169bb8c83fd0d54504dc6',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/6105868aa1d66524b92b99ba/businesses//9c31dfe0-65c5-47d4-8d6b-1c4faabd7c1b.jpg',
      },
      {
        cover: false,
        _id: '62d169bb8c83fd0d54504dc7',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/6105868aa1d66524b92b99ba/businesses//834ee91c-4642-435f-b8f7-f62c7282d571.jpg',
      },
      {
        cover: false,
        _id: '62d169bb8c83fd0d54504dc8',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/6105868aa1d66524b92b99ba/businesses//29f38d35-2255-4af8-aedd-7491d6c6f4e2.jpg',
      },
      {
        cover: false,
        _id: '62d169bb8c83fd0d54504dc9',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/6105868aa1d66524b92b99ba/businesses//eceb98ac-4b2a-4484-b93e-a035f0cedaaf.jpg',
      },
    ],
    thumbnail:
      'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/6105868aa1d66524b92b99ba/businesses//137f1d70-3ef7-43b5-a52e-cdec6554e343.jpg',
    ownerId: '6105868aa1d66524b92b99ba',
    reviews: [],
    favorites: 0,
    createdAt: '2022-07-15T13:20:59.652Z',
    updatedAt: '2022-08-26T16:19:53.825Z',
    __v: 0,
    averageRatings: null,
  },
  {
    _id: '5fe9b8c35de14f426e0596fd',
    views: 358,
    tags: [
      'BBQ',
      'Beverages',
      'Broast',
      'Chai',
      'Dish',
      'Food',
      'Naan',
      'Paratha',
      'Outing',
      'Roti',
    ],
    name: 'Bismillah Hotel and BBQ',
    description:
      'Dine-in, takeaway & delivery available.\nFree Delivery P 10A & 11A upto 300 rupees.\ndelivery charges 50 Rupees per order.\nDelivery timings 45-60 mins.',
    telephone: '0300-3348802',
    established: null,
    category: 'Food',
    address: 'Bahria Town Karachi,  Karachi City, Sindh',
    location: {
      coordinates: [25.033579058790032, 67.33104262501],
      _id: '602a62210bad35480095db58',
      type: 'Point',
    },
    openHours: [
      {
        _id: '602a62210bad35480095db59',
        day: 'Monday',
        to: '08:00 pm',
        from: '11:00 am',
      },
      {
        _id: '602a62210bad35480095db5a',
        day: 'Tuesday',
        to: '08:00 pm',
        from: '11:00 am',
      },
      {
        _id: '602a62210bad35480095db5b',
        day: 'Wednesday',
        to: '08:00 pm',
        from: '11:00 am',
      },
      {
        _id: '602a62210bad35480095db5c',
        day: 'Thursday',
        to: '08:00 pm',
        from: '11:00 am',
      },
      {
        _id: '602a62210bad35480095db5d',
        day: 'Friday',
        to: '08:00 pm',
        from: '11:00 am',
      },
      {
        _id: '602a62210bad35480095db5e',
        day: 'Saturday',
        to: '08:00 pm',
        from: '11:00 am',
      },
      {
        _id: '602a62210bad35480095db5f',
        day: 'Sunday',
        to: '08:00 pm',
        from: '11:00 am',
      },
    ],
    priceRange: {
      _id: '602a62210bad35480095db60',
      from: 'RS 100',
      to: 'RS 1000',
    },
    gallery: [
      {
        cover: true,
        _id: '5fe9b8c35de14f426e059707',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/5fe0afc7ec31e556bb05ae5a/businesses//bismillah-hotel-cover.png',
      },
    ],
    thumbnail:
      'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/5fe0afc7ec31e556bb05ae5a/businesses//0adf3ec4-37d5-4b28-a5b5-2656104fd0ad.jpg',
    ownerId: '5fe0afc7ec31e556bb05ae5a',
    facilities: [],
    reviews: [],
    createdAt: '2020-12-28T10:51:47.372Z',
    updatedAt: '2022-08-25T01:26:51.249Z',
    __v: 0,
    favorites: 0,
    averageRatings: null,
  },
  {
    _id: '628e7ffc15629741c4f1792d',
    status: 'PENDING',
    views: 349,
    tags: ['Beverages', 'Burger', 'Fast Food', 'Fries', 'Soft Drink'],
    name: 'Burger Lab',
    description:
      'We flip succulent meaty patties with luscious flavors to put your all hunger and cravings at rest.',
    telephone: '03482921736',
    established: null,
    category: 'Food',
    facilities: [],
    address: 'Midway commerical ground floor B-239',
    location: {
      coordinates: [25.0295902, 67.3085005],
      _id: '628e855c15629741c4f17a80',
      type: 'Point',
    },
    openHours: [
      {
        _id: '628e855c15629741c4f17a81',
        day: 'Monday',
        to: '02:00 am',
        from: '12:00 pm',
      },
      {
        _id: '628e855c15629741c4f17a82',
        day: 'Tuesday',
        to: '02:00 am',
        from: '12:00 pm',
      },
      {
        _id: '628e855c15629741c4f17a83',
        day: 'Wednesday',
        to: '02:00 am',
        from: '12:00 pm',
      },
      {
        _id: '628e855c15629741c4f17a84',
        day: 'Thursday',
        to: '02:00 am',
        from: '12:00 pm',
      },
      {
        _id: '628e855c15629741c4f17a85',
        day: 'Friday',
        to: '02:00 am',
        from: '12:00 pm',
      },
      {
        _id: '628e855c15629741c4f17a86',
        day: 'Saturday',
        to: '02:00 am',
        from: '12:00 pm',
      },
      {
        _id: '628e855c15629741c4f17a87',
        day: 'Sunday',
        to: '02:00 am',
        from: '12:00 pm',
      },
    ],
    priceRange: {
      _id: '628e855c15629741c4f17a88',
      from: 'RS 220',
      to: 'RS 15000',
    },
    gallery: [
      {
        cover: true,
        _id: '628e826815629741c4f179a8',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/628e7c9015629741c4f1790b/businesses//ab846636-e10c-4e60-9f25-730a9bfd6da7.jpg',
      },
      {
        cover: false,
        _id: '628e826815629741c4f179a9',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/628e7c9015629741c4f1790b/businesses//28fe58fb-65ec-4c57-abed-cc81e99fb029.jpg',
      },
      {
        cover: false,
        _id: '628e826815629741c4f179aa',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/628e7c9015629741c4f1790b/businesses//713423e9-bed5-44d5-8a9f-3a1eefb099d3.jpg',
      },
      {
        cover: false,
        _id: '628e826815629741c4f179ab',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/628e7c9015629741c4f1790b/businesses//df6efb13-8f97-4242-8f9d-ff522f69c79f.jpg',
      },
      {
        cover: false,
        _id: '628e826815629741c4f179ac',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/628e7c9015629741c4f1790b/businesses//ef56e200-6035-4536-8a0d-09af79efd48d.jpg',
      },
      {
        cover: false,
        _id: '628e855c15629741c4f17a8e',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/628e7c9015629741c4f1790b/businesses//1653507171234.jpg',
      },
      {
        cover: false,
        _id: '628e855c15629741c4f17a8f',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/628e7c9015629741c4f1790b/businesses//1653507167105.jpg',
      },
      {
        cover: false,
        _id: '628e855c15629741c4f17a90',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/628e7c9015629741c4f1790b/businesses//1653507161822.jpg',
      },
      {
        cover: false,
        _id: '628e855c15629741c4f17a91',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/628e7c9015629741c4f1790b/businesses//1653507158340.jpg',
      },
      {
        cover: false,
        _id: '628e855c15629741c4f17a92',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/628e7c9015629741c4f1790b/businesses//1653507147519.jpg',
      },
      {
        cover: false,
        _id: '628e855c15629741c4f17a93',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/628e7c9015629741c4f1790b/businesses//1653507103113.jpg',
      },
      {
        cover: false,
        _id: '628e855c15629741c4f17a94',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/628e7c9015629741c4f1790b/businesses//1653507095514.jpg',
      },
      {
        cover: false,
        _id: '628e855c15629741c4f17a95',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/628e7c9015629741c4f1790b/businesses//1653507077513.jpg',
      },
      {
        cover: false,
        _id: '628e855c15629741c4f17a96',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/628e7c9015629741c4f1790b/businesses//1653507064910.jpg',
      },
      {
        cover: false,
        _id: '628e855c15629741c4f17a97',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/628e7c9015629741c4f1790b/businesses//1653507041710.jpg',
      },
    ],
    ownerId: '628e7c9015629741c4f1790b',
    reviews: [],
    favorites: 0,
    createdAt: '2022-05-25T19:14:04.740Z',
    updatedAt: '2022-08-25T13:13:56.704Z',
    __v: 0,
    thumbnail:
      'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/6238bbfd15629741c4f0e427/businesses//8d9b9918-bef0-4b71-b7fc-6342eb0cb0c8.jpg',
    averageRatings: null,
  },
  {
    _id: '5fe841815de14f426e059652',
    views: 216,
    tags: [
      'BBQ',
      'Broast',
      'Burger',
      'Fast Food',
      'Food',
      'Fries',
      'Soft Drink',
      'Outing',
      'Casual Dining',
    ],
    name: "McDonald's Bahria Theme Park",
    description:
      "We are scrupulous about following the laws of the Pakistan to ensure the highest food safety and Halal standards. Food safety regulations differ from country to country and range from standards set by local government authorities to internat regulatory bodies such as the World Health Organization. Generally, McDonald's sets its own company standards at or above the very highest of international standards.",
    telephone: '021111244622',
    website: 'https://mcdelivery.com.pk',
    established: null,
    category: 'Food',
    address:
      'Bahria Adventure Land Theme Park, Bahria town Karachi, Karachi City, Sindh',
    location: {
      coordinates: [25.02313373716949, 67.31268927454948],
      _id: '602addb00bad35480095dbba',
      type: 'Point',
    },
    openHours: [
      {
        _id: '602addb00bad35480095dbbb',
        day: 'Monday',
        to: '12:00 am',
        from: '11:00 am',
      },
      {
        _id: '602addb00bad35480095dbbc',
        day: 'Tuesday',
        to: '12:00 am',
        from: '11:00 am',
      },
      {
        _id: '602addb00bad35480095dbbd',
        day: 'Wednesday',
        to: '12:00 am',
        from: '11:00 am',
      },
      {
        _id: '602addb00bad35480095dbbe',
        day: 'Thursday',
        to: '12:00 am',
        from: '11:00 am',
      },
      {
        _id: '602addb00bad35480095dbbf',
        day: 'Friday',
        to: '12:00 am',
        from: '11:00 am',
      },
      {
        _id: '602addb00bad35480095dbc0',
        day: 'Saturday',
        to: '12:00 am',
        from: '11:00 am',
      },
      {
        _id: '602addb00bad35480095dbc1',
        day: 'Sunday',
        to: '12:00 am',
        from: '11:00 am',
      },
    ],
    priceRange: {
      _id: '602addb00bad35480095dbc2',
      from: 'RS 300',
      to: 'RS 2000',
    },
    gallery: [
      {
        cover: true,
        _id: '5fe841815de14f426e05965c',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/5fe0afc7ec31e556bb05ae5a/businesses//mcdonalds-cover.png',
      },
    ],
    thumbnail:
      'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/5fe0afc7ec31e556bb05ae5a/businesses//b1880541-46d0-4d20-a191-1adfbd8c03b5.jpg',
    ownerId: '5fe0afc7ec31e556bb05ae5a',
    facilities: [],
    reviews: [],
    createdAt: '2020-12-27T08:10:41.849Z',
    updatedAt: '2022-08-23T20:37:00.606Z',
    __v: 0,
    averageRatings: null,
    favorites: 0,
  },
  {
    _id: '5ff96626bab8645c3db50dab',
    status: 'PENDING',
    views: 210,
    tags: [],
    name: 'Rabia Amir (Home Made Food)',
    description: 'Home made food available for delivery.',
    telephone: '03003643519',
    email: 'rab.ikhanazziz@gmail.com',
    established: '2021-01-09T08:07:22.247Z',
    category: 'Food',
    address: 'Villa 989 Street 15 Precinct 10A',
    location: {
      coordinates: [25.0559397, 67.3146357],
      _id: '5ff96626bab8645c3db50dac',
      type: 'Point',
    },
    openHours: [
      {
        _id: '5ff96626bab8645c3db50dad',
        day: 'Monday',
        to: '05:00 pm',
        from: '09:00 am',
      },
      {
        _id: '5ff96626bab8645c3db50dae',
        day: 'Tuesday',
        to: '05:00 pm',
        from: '09:00 am',
      },
      {
        _id: '5ff96626bab8645c3db50daf',
        day: 'Wednesday',
        to: '05:00 pm',
        from: '09:00 am',
      },
      {
        _id: '5ff96626bab8645c3db50db0',
        day: 'Thursday',
        to: '05:00 pm',
        from: '09:00 am',
      },
      {
        _id: '5ff96626bab8645c3db50db1',
        day: 'Friday',
        to: '05:00 pm',
        from: '09:00 am',
      },
      {
        _id: '5ff96626bab8645c3db50db2',
        day: 'Saturday',
        to: '05:00 pm',
        from: '09:00 am',
      },
      {
        _id: '5ff96626bab8645c3db50db3',
        day: 'Sunday',
        to: '05:00 pm',
        from: '09:00 am',
      },
    ],
    priceRange: {
      _id: '5ff96626bab8645c3db50db4',
      from: 'RS 200',
      to: 'RS 2000',
    },
    gallery: [],
    ownerId: '5ff6faffbab8645c3db50d91',
    facilities: [],
    reviews: [],
    createdAt: '2021-01-09T08:15:34.328Z',
    updatedAt: '2022-08-25T01:27:08.121Z',
    __v: 0,
    favorites: 0,
    averageRatings: null,
  },
  {
    _id: '6009424aef97551564947fbe',
    status: 'PENDING',
    views: 158,
    tags: ['Food', 'Fast Food', 'BBQ', 'Burger', 'Pizza', 'Roll', 'Sandwich'],
    name: 'Rendezvous Restaurant & Club',
    description:
      'A club with few indoor games and café. Nowadays i offering sunday breakfast having traditional dishes. Like Halwa poori, lassi and otherthings.Come and enjoy your day.\n\nClub No: 03002019737\nRestaurant No: 03224073963',
    telephone: '03224073963',
    established: null,
    category: 'Food',
    address: 'Near Main Gate, Bahria Town Karachi, Karachi City, Sindh',
    location: {
      coordinates: [24.991985101650204, 67.31268391013145],
      _id: '6049a654f1955656c30f9d8c',
      type: 'Point',
    },
    openHours: [
      {
        _id: '6049a654f1955656c30f9d8d',
        day: 'Sunday',
        to: '01:00 pm',
        from: '09:00 am',
      },
    ],
    gallery: [
      {
        cover: true,
        _id: '6009424aef97551564947fc1',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/undefined/businesses//rendezvous-club-cover.png',
      },
    ],
    thumbnail:
      'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/undefined/businesses//7dc12ca9-749f-43f2-82bc-9ab2dcaa87f0.jpg',
    ownerId: '5fe0afc7ec31e556bb05ae5a',
    facilities: [],
    reviews: [],
    favorites: 1,
    createdAt: '2021-01-21T08:58:50.797Z',
    updatedAt: '2022-08-22T12:50:53.585Z',
    __v: 0,
    averageRatings: null,
  },
  {
    _id: '6019898def97551564948146',
    status: 'PENDING',
    views: 149,
    tags: [
      'Pizza',
      'Burger',
      'Food',
      'Fast Food',
      'Fries',
      'Soft Drink',
      'Mineral Water',
    ],
    name: 'OPTP (Midway Commercial)',
    description:
      'Welcome to OPTP. We offer the best french fries in Pakistan. We also offer fast food and online food delivery to your door step. Order your favorite fast food online!',
    telephone: '03012267576',
    established: null,
    category: 'Food',
    address: 'Midway Commercial B, Bahria Town Karachi',
    location: {
      coordinates: [25.028761616683173, 67.30817712843418],
      _id: '6049e657f1955656c30f9ecc',
      type: 'Point',
    },
    openHours: [
      {
        _id: '6049e657f1955656c30f9ecd',
        day: 'Monday',
        to: '02:00 am',
        from: '11:00 am',
      },
      {
        _id: '6049e657f1955656c30f9ece',
        day: 'Tuesday',
        to: '02:00 am',
        from: '11:00 am',
      },
      {
        _id: '6049e657f1955656c30f9ecf',
        day: 'Wednesday',
        to: '02:00 am',
        from: '11:00 am',
      },
      {
        _id: '6049e657f1955656c30f9ed0',
        day: 'Thursday',
        to: '02:00 am',
        from: '11:00 am',
      },
      {
        _id: '6049e657f1955656c30f9ed1',
        day: 'Friday',
        to: '02:00 am',
        from: '11:00 am',
      },
      {
        _id: '6049e657f1955656c30f9ed2',
        day: 'Saturday',
        to: '02:00 am',
        from: '11:00 am',
      },
      {
        _id: '6049e657f1955656c30f9ed3',
        day: 'Sunday',
        to: '02:00 am',
        from: '11:00 am',
      },
    ],
    gallery: [
      {
        cover: true,
        _id: '6019898def9755156494814f',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/undefined/businesses//optp-midway-cover.png',
      },
      {
        cover: false,
        _id: '6019898def97551564948150',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/undefined/businesses//optp-midway-background.png',
      },
    ],
    thumbnail:
      'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/undefined/businesses//b4ca2057-19b7-49f8-aeb0-118ef8a5a102.jpg',
    ownerId: '5fe0afc7ec31e556bb05ae5a',
    facilities: [],
    reviews: [],
    favorites: 0,
    createdAt: '2021-02-02T17:19:09.988Z',
    updatedAt: '2022-08-26T16:26:59.238Z',
    __v: 0,
    averageRatings: null,
  },
  {
    _id: '5ff966d1bab8645c3db50db7',
    status: 'PENDING',
    views: 144,
    tags: [],
    name: "Daadi's Kitchen (Home Made Food)",
    description: 'Home made food available for delivery.',
    telephone: '03003643519',
    email: 'rab.ikhanazziz@gmail.com',
    established: '2021-01-09T08:07:22.247Z',
    category: 'Food',
    address: 'Precinct 10A',
    location: {
      coordinates: [25.0559397, 67.3146357],
      _id: '5ff966d1bab8645c3db50db8',
      type: 'Point',
    },
    openHours: [
      {
        _id: '5ff966d1bab8645c3db50db9',
        day: 'Monday',
        to: '05:00 pm',
        from: '09:00 am',
      },
      {
        _id: '5ff966d1bab8645c3db50dba',
        day: 'Tuesday',
        to: '05:00 pm',
        from: '09:00 am',
      },
      {
        _id: '5ff966d1bab8645c3db50dbb',
        day: 'Wednesday',
        to: '05:00 pm',
        from: '09:00 am',
      },
      {
        _id: '5ff966d1bab8645c3db50dbc',
        day: 'Thursday',
        to: '05:00 pm',
        from: '09:00 am',
      },
      {
        _id: '5ff966d1bab8645c3db50dbd',
        day: 'Friday',
        to: '05:00 pm',
        from: '09:00 am',
      },
      {
        _id: '5ff966d1bab8645c3db50dbe',
        day: 'Saturday',
        to: '05:00 pm',
        from: '09:00 am',
      },
      {
        _id: '5ff966d1bab8645c3db50dbf',
        day: 'Sunday',
        to: '05:00 pm',
        from: '09:00 am',
      },
    ],
    priceRange: { _id: '5ff966d1bab8645c3db50dc0', from: 'RS 1' },
    gallery: [],
    ownerId: '5ff6faffbab8645c3db50d91',
    facilities: [],
    reviews: [],
    createdAt: '2021-01-09T08:18:25.749Z',
    updatedAt: '2022-08-14T08:57:07.607Z',
    __v: 0,
    averageRatings: null,
    favorites: 0,
  },
  {
    _id: '5ff1ba53bab8645c3db50c0d',
    status: 'PENDING',
    views: 135,
    tags: [],
    name: 'Pizza Hub',
    description: '',
    telephone: '03212740604',
    email: 'kamranjamil12@gmail.com',
    established: '2012-06-06T12:17:23.464Z',
    category: 'Food',
    address: 'https://maps.app.goo.gl/dXQub4b8R8LSo7sd9',
    location: {
      coordinates: [25.0141904, 67.2725909],
      _id: '5ff1ba53bab8645c3db50c0e',
      type: 'Point',
    },
    openHours: [
      {
        _id: '5ff1ba53bab8645c3db50c0f',
        day: 'Monday',
        to: '01:00 am',
        from: '01:00 pm',
      },
      {
        _id: '5ff1ba53bab8645c3db50c10',
        day: 'Tuesday',
        to: '01:00 am',
        from: '01:00 pm',
      },
      {
        _id: '5ff1ba53bab8645c3db50c11',
        day: 'Wednesday',
        to: '01:00 am',
        from: '01:00 pm',
      },
      {
        _id: '5ff1ba53bab8645c3db50c12',
        day: 'Thursday',
        to: '01:00 am',
        from: '01:00 pm',
      },
      {
        _id: '5ff1ba53bab8645c3db50c13',
        day: 'Friday',
        to: '01:00 am',
        from: '01:00 pm',
      },
      {
        _id: '5ff1ba53bab8645c3db50c14',
        day: 'Saturday',
        to: '01:00 am',
        from: '01:00 pm',
      },
      {
        _id: '5ff1ba53bab8645c3db50c15',
        day: 'Sunday',
        to: '01:00 am',
        from: '01:00 pm',
      },
    ],
    priceRange: {
      _id: '5ff1ba53bab8645c3db50c16',
      from: 'RS 350',
      to: 'RS 1800',
    },
    gallery: [
      {
        cover: true,
        _id: '5ff1ba53bab8645c3db50c17',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/5ff1b7b2bab8645c3db50c04/businesses//fceb4851-cfe2-46c4-ac40-35aeb8244e37.jpg',
      },
    ],
    thumbnail:
      'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/5ff1b7b2bab8645c3db50c04/businesses//c77348ab-a0ee-4f06-b3b4-44a94a826551.jpg',
    ownerId: '5ff1b7b2bab8645c3db50c04',
    facilities: [],
    reviews: [],
    createdAt: '2021-01-03T12:36:35.995Z',
    updatedAt: '2022-08-14T06:54:15.904Z',
    __v: 0,
    averageRatings: null,
    favorites: 0,
  },
  {
    _id: '6140dfca15629741c4ef6827',
    status: 'PENDING',
    views: 132,
    tags: [
      'Beverages',
      'Biscuit',
      'Broast',
      'Burger',
      'Cafe',
      'Cakes',
      'Chai',
      'Chicken',
      'Dish',
      'Fast Food',
      'Food',
      'Fries',
      'Fruites',
      'Juice',
      'Meat',
      'Mineral Water',
      'Naan',
      'Nuggets',
      'Paratha',
      'Roll',
      'Roti',
      'Samosa',
      'Sandwich',
      'Soft Drink',
      'Sweet Shop',
      'Vegetables',
      'Yogurt',
    ],
    name: 'FaZa Foods',
    description: 'Pakistani cuisine',
    telephone: '03492862628',
    established: '2021-09-14T19:00:24.957Z',
    category: 'Food',
    facilities: [],
    address: 'Dominion Business Center 2 Main Jinnah Avenue Near Main Gate.',
    location: {
      coordinates: [25.000110061611846, 67.31395024806261],
      _id: '6166ce7015629741c4efa7f8',
      type: 'Point',
    },
    openHours: [
      {
        _id: '6166ce7015629741c4efa7f9',
        day: 'Monday',
        to: '08:00 pm',
        from: '12:00 pm',
      },
      {
        _id: '6166ce7015629741c4efa7fa',
        day: 'Tuesday',
        to: '08:00 pm',
        from: '12:00 pm',
      },
      {
        _id: '6166ce7015629741c4efa7fb',
        day: 'Wednesday',
        to: '08:00 pm',
        from: '12:00 pm',
      },
      {
        _id: '6166ce7015629741c4efa7fc',
        day: 'Thursday',
        to: '08:00 pm',
        from: '12:00 pm',
      },
      {
        _id: '6166ce7015629741c4efa7fd',
        day: 'Friday',
        to: '08:00 pm',
        from: '12:00 pm',
      },
      {
        _id: '6166ce7015629741c4efa7fe',
        day: 'Saturday',
        to: '08:00 pm',
        from: '12:00 pm',
      },
    ],
    priceRange: {
      _id: '6166ce7015629741c4efa7ff',
      from: 'RS 180',
      to: 'RS 300',
    },
    gallery: [
      {
        cover: true,
        _id: '6142add815629741c4ef6cb3',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/613fa26215629741c4ef6573/businesses//26786374-6ba9-468c-9c48-69bf08a11636.jpg',
      },
      {
        cover: false,
        _id: '6142add815629741c4ef6cb4',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/613fa26215629741c4ef6573/businesses//7e4e9459-d321-4c50-9fca-4254c5528736.jpg',
      },
      {
        cover: false,
        _id: '614cbbc715629741c4ef7acf',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/613fa26215629741c4ef6573/businesses//91435b15-5c8b-48e9-96e8-613ae1ce3b09.jpg',
      },
      {
        cover: false,
        _id: '614cbbc715629741c4ef7ad0',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/613fa26215629741c4ef6573/businesses//0c6d44db-3437-450d-9e75-a82589ff4928.jpg',
      },
      {
        cover: false,
        _id: '6166ce7015629741c4efa804',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/613fa26215629741c4ef6573/businesses//94a17370-8749-4e14-b932-23fb4d1d1489.jpg',
      },
    ],
    thumbnail:
      'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/613fa26215629741c4ef6573/businesses//ff40b43b-c814-4846-95b6-cdb0daa8ad11.jpg',
    ownerId: '613fa26215629741c4ef6573',
    reviews: [],
    favorites: 0,
    createdAt: '2021-09-14T17:45:46.282Z',
    updatedAt: '2022-08-14T08:57:44.884Z',
    __v: 0,
    averageRatings: null,
  },
  {
    _id: '5fea32685de14f426e05970c',
    views: 124,
    tags: ['Fast Food', 'Food', 'Fries', 'Casual Dining', 'Outing'],
    name: 'Cheezy Hub',
    description:
      'Celebrate Your Occasion,\nBusiness Meetings, Lunch & Dinners (upto 25 persons capacity).\n\nOnly Rs 5000/- (complementary drinks included) menu as per requirements.',
    telephone: '03332629788',
    email: 'cheezyhub.pk@gmail.com',
    established: null,
    category: 'Food',
    address:
      'Office No 6-B, Floor 6 Street 7&8, Building #142-A, Midway Commercial-A, Bahria Town Karachi, Karachi City, Sindh',
    location: {
      coordinates: [25.021673028607175, 67.30503156781197],
      _id: '602ade130bad35480095dbc4',
      type: 'Point',
    },
    openHours: [
      {
        _id: '602ade130bad35480095dbc5',
        day: 'Monday',
        to: '08:00 pm',
        from: '11:00 am',
      },
      {
        _id: '602ade130bad35480095dbc6',
        day: 'Tuesday',
        to: '08:00 pm',
        from: '11:00 am',
      },
      {
        _id: '602ade130bad35480095dbc7',
        day: 'Wednesday',
        to: '08:00 pm',
        from: '11:00 am',
      },
      {
        _id: '602ade130bad35480095dbc8',
        day: 'Thursday',
        to: '08:00 pm',
        from: '11:00 am',
      },
      {
        _id: '602ade130bad35480095dbc9',
        day: 'Friday',
        to: '08:00 pm',
        from: '11:00 am',
      },
      {
        _id: '602ade130bad35480095dbca',
        day: 'Saturday',
        to: '08:00 pm',
        from: '11:00 am',
      },
      {
        _id: '602ade130bad35480095dbcb',
        day: 'Sunday',
        to: '08:00 pm',
        from: '11:00 am',
      },
    ],
    gallery: [
      {
        cover: true,
        _id: '5fea32685de14f426e059715',
        image:
          'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/5fe0afc7ec31e556bb05ae5a/businesses//cheezy-hub-cover.png',
      },
    ],
    thumbnail:
      'https://btk-explore-prod.s3.ap-southeast-1.amazonaws.com/users/5fe0afc7ec31e556bb05ae5a/businesses//3d5e2fe9-912a-4b43-9cbc-6865a09f0fb8.jpg',
    ownerId: '5fe0afc7ec31e556bb05ae5a',
    facilities: [],
    reviews: [],
    createdAt: '2020-12-28T19:30:48.693Z',
    updatedAt: '2022-08-14T08:58:13.390Z',
    __v: 0,
    averageRatings: null,
    favorites: 0,
  },
];
