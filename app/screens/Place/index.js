import React, { useState, useRef, useEffect } from 'react';
import {
  RefreshControl,
  View,
  Animated,
  ActivityIndicator,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { BaseStyle, BaseColor, useTheme } from '@config';
import Carousel from 'react-native-snap-carousel';
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
import styles from './styles';
import * as Utils from '@utils';
import { PlaceListData } from '@data';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBusinesses, setSearchBusiness } from '../../actions/business';
import { showBetaModal } from '../../popup/betaPopup';

export default function Place(props) {
  const { navigation, route } = props;
  const dispatch = useDispatch();
  const [limit] = useState(10);
  const [skip, setSkip] = useState(0);
  const [refresh, setRefresh] = useState(false);

  const getBusinesses = () => {
    let payload = {
      limit,
      skip,
      loading: !refresh,
      refreshLoading: refresh,
      search: stateProps.searchBusiness,
    };
    if (route?.params?.popular) {
      payload.popular = true;
    }
    if (route?.params?.category) {
      payload.category = route.params.category;
    }
    dispatch(getAllBusinesses(payload));
  };

  useEffect(() => {
    getBusinesses();
  }, [skip]);

  useEffect(() => {
    return () => {
      dispatch({ type: 'CLEAR_ALL_BUSINESSES_API' });
      dispatch(setSearchBusiness(''));
    };
  }, [dispatch]);

  const stateProps = useSelector(({ businesses, favorites }) => {
    return {
      loading: businesses.getAllBusinessesLoading,
      data: businesses.allBusinesses,
      loadMoreLoading: businesses.getAllBusinessesLoadMoreLoading,
      isLoadMore: businesses.isLoadMore,
      refreshLoading: businesses.refreshLoading,
      favoriteBusinesses: favorites.getFavoriteBusinesses,
      searchBusiness: businesses.searchBusiness,
    };
  });

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

  const [active, setActive] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(Utils.getWidthDevice());
  const [modeView, setModeView] = useState('grid');
  const [mapView, setMapView] = useState(false);
  const [region, setRegion] = useState({
    latitude: PlaceListData[0].region.latitude,
    longitude: PlaceListData[0].region.longitude,
    latitudeDelta: 0.009,
    longitudeDelta: 0.004,
  });
  const [list] = useState(PlaceListData);

  /**
   * export viewport
   * @param {*} percentage
   * @returns
   */
  const getViewPort = (percentage) => {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
  };

  /**
   * call when on change sort
   */
  const onChangeSort = () => {};

  /**
   * @description Open modal when filterring mode is applied
   * @author Passion UI <passionui.com>
   * @date 2019-09-01
   */
  const onFilter = () => {
    showBetaModal();
    // navigation.navigate('Filter');
  };

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

  const onSelectLocation = (location) => {
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      if (
        element.region.latitude == location.latitude &&
        element.region.longitude == location.longitude
      ) {
        sliderRef.current.snapToItem(index);
        return;
      }
    }
  };

  const navigateToSearchPage = () => {
    navigation.navigate('SearchHistory', {
      popular: route?.params?.popular,
      category: route?.params?.category,
    });
  };

  const navigateBusinessDetail = (id) => {
    navigation.navigate('PlaceDetail', { id });
  };

  const navigateToReview = (id) => {
    navigation.navigate('Review', { id });
  };

  const onScrollHandler = () => {
    if (stateProps.loading || stateProps.isLoadMore) {
      return;
    }
    setSkip(stateProps.data.length);
  };
  const onRefreshHandler = () => {
    setRefresh(true);
    setSkip(0);
  };

  const renderFooter = () => {
    if (stateProps.data.length && stateProps.loadMoreLoading) {
      return (
        <View style={styles.listFooter}>
          <ActivityIndicator size="large" color={BaseColor.blueColor} />
        </View>
      );
    }
    return null;
  };

  const listEmptyComponent = () => {
    return (
      <View style={styles.sectionEmpty}>
        <Text semibold style={styles.sectionEmptyText}>
          {stateProps.searchBusiness
            ? 'No Search Results Found, Try different keywords'
            : `No ${route?.params?.title || t('place')} Available`}
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
                flex: stateProps?.data?.length ? 0 : 1,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={stateProps.refreshLoading}
                  progressViewOffset={80}
                  onRefresh={() => onRefreshHandler()}
                />
              }
              onEndReached={onScrollHandler}
              onEndThreshold={0.1}
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
              data={stateProps.data}
              key={'block'}
              keyExtractor={(item, index) => item._id}
              ListEmptyComponent={listEmptyComponent}
              renderItem={({ item, index }) => (
                <PlaceItem
                  block
                  image={item?.thumbnail}
                  title={item.name}
                  subtitle={item.category}
                  location={item.address}
                  phone={item.telephone}
                  rate={item?.averageRatings}
                  status={item?.status}
                  // rateStatus={item?.rateStatus}
                  numReviews={item?.reviews?.length}
                  isFavorite={stateProps?.favoriteBusinesses?.some(
                    (obj) => obj._id === item?._id,
                  )}
                  businessId={item?._id}
                  navigation={navigation}
                  lastRoute={route?.param?.category ? 'Category' : 'Place'}
                  onPress={() => navigateBusinessDetail(item._id)}
                  onPressTag={() => navigateToReview(item._id)}
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
                onFilter={onFilter}
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
                flex: stateProps?.data?.length ? 0 : 1,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={stateProps.refreshLoading}
                  progressViewOffset={80}
                  onRefresh={() => onRefreshHandler()}
                />
              }
              onEndReached={onScrollHandler}
              onEndThreshold={0.1}
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
              data={stateProps.data}
              key={'list'}
              keyExtractor={(item, index) => item._id}
              ListFooterComponent={renderFooter}
              ListEmptyComponent={listEmptyComponent}
              renderItem={({ item, index }) => (
                <PlaceItem
                  list
                  image={item?.thumbnail}
                  title={item.name}
                  subtitle={item.category}
                  location={item.address}
                  phone={item.telephone}
                  rate={item?.averageRatings}
                  status={item?.status}
                  rateStatus={item?.rateStatus}
                  numReviews={item?.reviews?.length}
                  isFavorite={stateProps?.favoriteBusinesses?.some(
                    (obj) => obj._id === item?._id,
                  )}
                  businessId={item?._id}
                  navigation={navigation}
                  lastRoute={route?.param?.category ? 'Category' : 'Place'}
                  style={{
                    marginBottom: 15,
                  }}
                  onPress={() => navigateBusinessDetail(item._id)}
                  onPressTag={() => navigateToReview(item._id)}
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
                onFilter={onFilter}
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
                flex: stateProps?.data?.length ? 0 : 1,
              }}
              columnWrapperStyle={{
                paddingLeft: 5,
                paddingRight: 20,
              }}
              refreshControl={
                <RefreshControl
                  colors={[colors.primary]}
                  tintColor={colors.primary}
                  refreshing={stateProps.refreshLoading}
                  progressViewOffset={80}
                  onRefresh={() => onRefreshHandler()}
                />
              }
              onEndReached={onScrollHandler}
              onEndThreshold={0.1}
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
              data={stateProps.data}
              key={'grid'}
              keyExtractor={(item, index) => item._id}
              ListFooterComponent={renderFooter}
              ListEmptyComponent={listEmptyComponent}
              renderItem={({ item, index }) => (
                <PlaceItem
                  grid
                  image={item?.thumbnail}
                  title={item.name}
                  subtitle={item.category}
                  location={item.address}
                  phone={item.telephone}
                  rate={item?.averageRatings}
                  status={item?.status}
                  rateStatus={item?.rateStatus}
                  numReviews={item?.reviews.length}
                  isFavorite={stateProps?.favoriteBusinesses?.some(
                    (obj) => obj._id === item?._id,
                  )}
                  businessId={item?._id}
                  navigation={navigation}
                  lastRoute={route?.param?.category ? 'Category' : 'Place'}
                  style={{
                    marginLeft: 15,
                    marginBottom: 15,
                  }}
                  onPress={() => navigateBusinessDetail(item._id)}
                  onPressTag={() => navigateToReview(item._id)}
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
                onFilter={onFilter}
              />
            </Animated.View>
          </View>
        );
        break;
    }
  };

  const renderMapView = () => {
    return (
      <View style={{ flex: 1 }}>
        <MapView provider={PROVIDER_GOOGLE} style={styles.map} region={region}>
          {stateProps.data.map((item, index) => {
            return (
              <Marker
                onPress={(e) => onSelectLocation(e.nativeEvent.coordinate)}
                key={item._id}
                coordinate={{
                  latitude: item?.location?.coordinates[0],
                  longitude: item?.location?.coordinates[1],
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
                      index == active ? BaseColor.whiteColor : colors.primary
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
            data={stateProps.data}
            renderItem={({ item, index }) => (
              <CardList
                image={item?.thumbnail}
                title={item.name}
                subtitle={item.category}
                rate={item?.averageRatings}
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
                onPress={() => navigateBusinessDetail(item._id)}
                onPressTag={() => navigateToReview(item._id)}
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
              setRegion({
                latitudeDelta: 0.009,
                longitudeDelta: 0.004,
                latitude:
                  stateProps.data[index] &&
                  stateProps.data[index]?.location?.coordinates[0],
                longitude:
                  stateProps.data[index] &&
                  stateProps.data[index]?.location?.coordinates[1],
              });
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <Header
        title={route?.params?.title || t('place')}
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
        {stateProps.loading ? (
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
