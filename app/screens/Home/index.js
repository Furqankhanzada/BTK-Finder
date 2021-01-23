import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Animated,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import Swiper from 'react-native-swiper';
import {
  Header,
  Button,
  Image,
  Text,
  Icon,
  SafeAreaView,
  CardList,
  PlaceItem,
  Card,
} from '@components';
import { BaseColor, useTheme } from '@config';
import * as Utils from '@utils';
import styles from './styles';
import { HomeBannerData } from '@data';
import FeaturedCategoryPlaceholderComponent from '../../components/Placeholders/featuredCategories';
import SectionList from './sectionList';
import { getCategories } from '../../actions/category';
import { getBusinesses } from '../../actions/business';
import { getFavoriteBusinesses } from '../../actions/favorites';
import { getProfile } from '../../actions/auth';

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
    if (isLogin) {
      dispatch(getProfile());
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
        fields: 'name, thumbnail, category, averageRatings',
      }),
    );
    dispatch(
      getFavoriteBusinesses({
        favorite: true,
        skip: 0,
        fields: 'name, thumbnail, category, averageRatings',
      }),
    );
  }, [dispatch]);

  const navigateBusinessDetail = (id) => {
    navigation.navigate('PlaceDetail', { id });
  };

  const seeMore = (payload = {}) => {
    if (payload.route === 'Category') {
      navigation.navigate('Category');
    } else {
      navigation.navigate('Place', payload);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={[
          styles.imageBackground,
          {
            height: deltaY.interpolate({
              inputRange: [
                0,
                Utils.scaleWithPixel(150),
                Utils.scaleWithPixel(150),
              ],
              outputRange: [heightImageBanner, heightHeader, heightHeader],
            }),
          },
        ]}>
        <Swiper
          dotStyle={{
            backgroundColor: colors.text,
          }}
          activeDotColor={colors.primary}
          paginationStyle={styles.contentPage}
          removeClippedSubviews={false}
          autoplay={true}
          autoplayTimeout={2}
          showsPagination={false}>
          {banner.map((item, index) => {
            return (
              <Image key={item.id} source={item.image} style={{ flex: 1 }} />
            );
          })}
        </Swiper>
      </Animated.View>
      <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always' }}>
        <Header
          title={''}
          renderRight={() => {
            // return <Icon name={'call'} size={20} color={colors.primary} />;
            return (
              <Button
                styleText={{ marginLeft: 8 }}
                style={{ width: 130, paddingHorizontal: 10, height: 30 }}
                icon={<Icon name={'phone'} size={15} color={'white'} solid />}
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
          {/*<View*/}
          {/*  style={[*/}
          {/*    styles.searchForm,*/}
          {/*    {*/}
          {/*      backgroundColor: colors.background,*/}
          {/*      borderColor: colors.border,*/}
          {/*      shadowColor: colors.border,*/}
          {/*    },*/}
          {/*    { marginTop: marginTopBanner },*/}
          {/*  ]}>*/}
          {/*  <TouchableOpacity*/}
          {/*    onPress={() => navigation.navigate('SearchHistory')}>*/}
          {/*    <View*/}
          {/*      style={[BaseStyle.textInput, { backgroundColor: colors.card }]}>*/}
          {/*      <Text body1 grayColor style={{ flex: 1 }}>*/}
          {/*        {t('search_location')}*/}
          {/*      </Text>*/}
          {/*      <View style={{ paddingVertical: 8 }}>*/}
          {/*        <View*/}
          {/*          style={[*/}
          {/*            styles.lineForm,*/}
          {/*            { backgroundColor: colors.border },*/}
          {/*          ]}*/}
          {/*        />*/}
          {/*      </View>*/}
          {/*      <Icon*/}
          {/*        name="location-arrow"*/}
          {/*        size={18}*/}
          {/*        color={colors.primaryLight}*/}
          {/*        solid*/}
          {/*      />*/}
          {/*    </View>*/}
          {/*  </TouchableOpacity>*/}
          {/*</View>*/}
          {/* services */}

          {loading ? (
            <FlatList
              contentContainerStyle={{
                padding: 20,
                marginTop: marginTopBanner,
              }}
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
              contentContainerStyle={{
                padding: 20,
                marginTop: marginTopBanner,
              }}
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
                        route: item.route,
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
                title: 'Recently Added Businesses',
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
