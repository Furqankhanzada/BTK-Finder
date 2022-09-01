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
                  isFavorite={
                    !!item?.favorites?.find(
                      (favorite: any) => favorite.ownerId === user._id,
                    )
                  }
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
                  isFavorite={
                    !!item?.favorites?.find(
                      (favorite: any) => favorite.ownerId === user._id,
                    )
                  }
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
                  isFavorite={
                    !!item?.favorites?.find(
                      (favorite: any) => favorite.ownerId === user._id,
                    )
                  }
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
