import React, { memo, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { firebase } from '@react-native-firebase/database';
import { getUniqueId } from 'react-native-device-info';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

import { SafeAreaView, Icon, Text, Tag, Image, Header } from '@components';
import { BaseStyle, useTheme } from '@config';
import { useRemoteConfig } from '@hooks';
import * as Utils from '@utils';
import Section from '@screens/dashboard/components/Section';
import { CategoryPresentable } from '@screens/category/modals/CategoryPresentables';
import HorizontalCategories from '@screens/dashboard/components/HorizontalCategories';
import VerticalBusinesses from '@screens/dashboard/components/VerticalBusinesses';
import HorizontalBusinesses from '@screens/dashboard/components/HorizontalBusinesses';
import { BusinessPresentable } from '@screens/businesses/models/BusinessPresentable';
import { BusinessesQueryKeysWithFav } from '@screens/businesses/models/BusinessesQueryKeys';
import {
  BannerPresentable,
  BannersPresentable,
} from '@screens/dashboard/models/BannersPresentable';
import { useNotifications } from '@screens/notifications/queries/queries';

import NotificationIcon from './components/NotificationIcon';
import { EVENTS, trackEvent } from '../../userTracking';
import { GlobalParamList } from '../../navigation/models/GlobalParamList';
import { MainStackParamList } from '../../navigation/models/MainStackParamList';
import {
  dashboardBannerUnitIdOne,
  dashboardBannerUnitIdTwo,
} from '../../hooks/useMobileAds';

const database = firebase
  .app()
  .database(
    'https://explore-btk-default-rtdb.asia-southeast1.firebasedatabase.app/',
  );

function DashboardScreen({
  navigation,
}: StackScreenProps<GlobalParamList, 'Dashboard'>) {
  const { colors } = useTheme();
  const remoteConfig = useRemoteConfig();
  const { data: notifications } = useNotifications(['notifications-count'], {
    deviceUniqueId: getUniqueId(),
    unreadCount: true,
  });

  const [banners, setBanners] = useState<BannersPresentable>();

  useEffect(() => {
    const onValueChange = database
      .ref('/home/banners')
      .on('value', (snapshot) => {
        setBanners(snapshot.val());
      });

    // Stop listening for updates when no longer required
    return () => database.ref('/home/banners').off('value', onValueChange);
  }, []);

  const onPressHelpLine = () => {
    navigation.navigate('HelpLine');
    trackEvent(EVENTS.HELPLINE_SCREEN_VISITED);
  };

  /**
   * on Refresh category
   */
  // const onRefresh = async () => {
  //   setRefreshing(true);
  // };

  const onCategoriesViewAllPress = () => {
    navigation.navigate('Category');
    trackEvent(EVENTS.CATEGORIES_SCREEN_VISITED);
  };

  const onCategoryPress = ({ name }: CategoryPresentable) => {
    trackEvent(EVENTS.CATEGORIES_SCREEN_VISITED);

    navigation.navigate('Businesses', {
      category: name,
      title: name,
    });
  };

  const onBusinessesViewAllPress = (
    params: MainStackParamList['Businesses'],
  ) => {
    navigation.navigate('Businesses', params);
    trackEvent(EVENTS.VISITED_BUSINESS);
  };

  const onBusinessPress = (business: BusinessPresentable) => {
    trackEvent(EVENTS.VISITED_BUSINESS);
    navigation.navigate('BusinessDetailTabNavigator', {
      businessId: business._id,
    });
  };

  /**
   * render content banner
   * @returns
   */
  const renderBanner = (banner?: BannerPresentable) => {
    if (!banner) {
      return;
    }
    return (
      <View style={styles.bannerContainer}>
        <View style={styles.banner}>
          <Image style={styles.bannerImage} source={banner.image} />
          <View style={styles.contentBannerTopLeft}>
            <Text style={[banner.titleStyle]} headline semibold whiteColor>
              {banner.title}
            </Text>
            <Text
              style={[styles.bannerText, banner.titleStyle]}
              footnote
              medium
              whiteColor>
              {banner.description}
            </Text>
          </View>
          <Tag
            style={styles.bannerButton}
            primary
            onPress={() => {
              navigation.navigate('BusinessDetailTabNavigator', {
                businessId: banner.businessId,
              });
            }}>
            {banner.buttonText}
          </Tag>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={'Explore BTK'}
        renderRightSecond={() => (
          <View style={styles.iconContainer}>
            <Icon name="headset" size={19} color={colors.primaryDark} solid />
          </View>
        )}
        onPressRightSecond={onPressHelpLine}
        renderRight={() => (
          <NotificationIcon
            count={
              notifications &&
              !Array.isArray(notifications) &&
              notifications?.unread
                ? notifications?.unread
                : 0
            }
          />
        )}
        onPressRight={() =>
          navigation.navigate('NotificationStack', {
            screen: 'Notification',
          })
        }
      />
      <TouchableOpacity
        onPress={() => navigation.navigate('Filter', {})}
        style={styles.contentSearch}>
        <View style={[BaseStyle.textInput, { backgroundColor: colors.card }]}>
          <Text body1 grayColor style={{ flex: 1 }}>
            Search everything near you
          </Text>
          <View style={{ paddingVertical: 8 }}>
            <View
              style={[styles.lineForm, { backgroundColor: colors.border }]}
            />
          </View>
          <Icon
            name="location-arrow"
            size={18}
            color={colors.primaryLight}
            solid
          />
        </View>
      </TouchableOpacity>
      <FlatList
        data={[1]}
        // refreshControl={
        //   <RefreshControl
        //     colors={[colors.primary]}
        //     tintColor={colors.primary}
        //     refreshing={refreshing}
        //     onRefresh={onRefresh}
        //   />
        // }
        renderItem={() => (
          <View>
            <Section
              title="Browse by categories"
              onViewAll={onCategoriesViewAllPress}
              isLoading={false}>
              <HorizontalCategories onPress={onCategoryPress} />
            </Section>
            <Section
              tag="New"
              title="With Menus/Products/Packages"
              subTitle="Find Restaurant, Shops, Gyms with Menus/Products/Packages, Now you can see their prices"
              onViewAll={() =>
                onBusinessesViewAllPress({
                  title: 'With Menus/Products/Packages',
                  tags: ['Products'],
                })
              }
              isLoading={false}>
              <HorizontalBusinesses
                onPress={onBusinessPress}
                queryKey={[BusinessesQueryKeysWithFav.restaurantsWithMenu]}
                params={{
                  tags: ['Products'],
                  fields: ['_id', 'name', 'thumbnail', 'favorites'].join(','),
                }}
              />
            </Section>
            {remoteConfig.ads?.dashboardBannerOne ? (
              <View>
                <BannerAd
                  unitId={dashboardBannerUnitIdOne}
                  size={BannerAdSize.FULL_BANNER}
                  requestOptions={{
                    requestNonPersonalizedAdsOnly: true,
                  }}
                />
              </View>
            ) : null}
            {remoteConfig.ads?.dashboardCustomAdBannerOne
              ? renderBanner(banners?.one)
              : null}
            <Section
              title="Restaurants"
              subTitle="Find Fast Food, Cakes, Pizza, Fries etc..."
              onViewAll={() =>
                onBusinessesViewAllPress({
                  title: 'Restaurants',
                  tags: ['Cakes', 'Fast Food', 'Cafe'],
                })
              }
              isLoading={false}>
              <HorizontalBusinesses
                onPress={onBusinessPress}
                queryKey={[BusinessesQueryKeysWithFav.restaurants]}
                params={{ tags: ['Cakes', 'Fast Food', 'Cafe'] }}
              />
            </Section>
            {remoteConfig.ads?.dashboardBannerTwo ? (
              <View>
                <BannerAd
                  unitId={dashboardBannerUnitIdTwo}
                  size={BannerAdSize.FULL_BANNER}
                  requestOptions={{
                    requestNonPersonalizedAdsOnly: true,
                  }}
                />
              </View>
            ) : null}
            {remoteConfig.ads?.dashboardCustomAdBannerTwo
              ? renderBanner(banners?.two)
              : null}
            <Section
              title="Transport"
              subTitle="Find Courier Service, Shuttle Service, CAB Service, Van Service and Internation Flight Services"
              onViewAll={() =>
                onBusinessesViewAllPress({
                  title: 'Transport',
                  category: 'Transport',
                })
              }
              isLoading={false}>
              <HorizontalBusinesses
                onPress={onBusinessPress}
                queryKey={[BusinessesQueryKeysWithFav.transport]}
                params={{ category: 'Transport' }}
              />
            </Section>
            <Section
              title="Education"
              subTitle="Find Schools, Book Shops, Quran Teachers, Home Tuitions"
              onViewAll={() =>
                onBusinessesViewAllPress({
                  title: 'Education',
                  category: 'Education',
                })
              }
              isLoading={false}>
              <HorizontalBusinesses
                onPress={onBusinessPress}
                queryKey={[BusinessesQueryKeysWithFav.education]}
                params={{ category: 'Education' }}
              />
            </Section>
            {renderBanner(banners?.three)}
            <Section
              title="Health & Fitness"
              subTitle="Find GYMs, Hospitals, Pharmacies"
              onViewAll={() =>
                onBusinessesViewAllPress({
                  title: 'Health & Fitness',
                  category: 'Health & Fitness',
                })
              }
              isLoading={false}>
              <HorizontalBusinesses
                onPress={onBusinessPress}
                queryKey={[BusinessesQueryKeysWithFav.healthFitness]}
                params={{ category: 'Health & Fitness' }}
              />
            </Section>
            <Section
              title="Entertainment"
              subTitle="Find DanZoo, Adventure Land (Theme Park), Dancing Fountain, Chirpy Part"
              onViewAll={() =>
                onBusinessesViewAllPress({
                  title: 'Entertainment',
                  category: 'Entertainment',
                })
              }
              isLoading={false}>
              <HorizontalBusinesses
                onPress={onBusinessPress}
                queryKey={[BusinessesQueryKeysWithFav.entertainment]}
                params={{ category: 'Entertainment' }}
              />
            </Section>
            {renderBanner(banners?.four)}
            <Section
              title="Maintenance and Services"
              subTitle="Find services related repairing, fixing, "
              onViewAll={() =>
                onBusinessesViewAllPress({
                  title: 'Maintenance and Services',
                  category: 'Maintenance and Services',
                })
              }
              isLoading={false}>
              <HorizontalBusinesses
                onPress={onBusinessPress}
                queryKey={[BusinessesQueryKeysWithFav.maintenanceAndServices]}
                params={{ category: 'Maintenance and Services' }}
              />
            </Section>
            <Section
              title="Real Estate"
              subTitle="Find services related Real Estate and Builders"
              onViewAll={() =>
                onBusinessesViewAllPress({
                  title: 'Real Estate',
                  category: 'Real Estate',
                })
              }
              isLoading={false}>
              <HorizontalBusinesses
                onPress={onBusinessPress}
                queryKey={[BusinessesQueryKeysWithFav.realEstate]}
                params={{ category: 'Real Estate' }}
              />
            </Section>
            <Section
              title="Salons"
              subTitle="Find Beauty Parlour and Salons"
              onViewAll={() =>
                onBusinessesViewAllPress({
                  title: 'Salons',
                  category: 'Salons',
                })
              }
              isLoading={false}>
              <HorizontalBusinesses
                onPress={onBusinessPress}
                queryKey={[BusinessesQueryKeysWithFav.salons]}
                params={{ category: 'Salons' }}
              />
            </Section>
            <Section
              title="Hardware Store"
              subTitle="Find Hardware Stores"
              onViewAll={() =>
                onBusinessesViewAllPress({
                  title: 'Hardware Store',
                  category: 'Hardware Store',
                })
              }
              isLoading={false}>
              <HorizontalBusinesses
                onPress={onBusinessPress}
                queryKey={[BusinessesQueryKeysWithFav.hardwareStore]}
                params={{ category: 'Hardware Store' }}
              />
            </Section>
            <Section
              title="Sewing & Alterations / Fabric Store"
              subTitle="Find Sewing & Alterations / Fabric Store"
              onViewAll={() =>
                onBusinessesViewAllPress({
                  title: 'Sewing & Alterations / Fabric Store',
                  category: 'Sewing & Alterations / Fabric Store',
                })
              }
              isLoading={false}>
              <HorizontalBusinesses
                onPress={onBusinessPress}
                queryKey={[
                  BusinessesQueryKeysWithFav.sewingAlterationsAndFabricStore,
                ]}
                params={{ category: 'Sewing & Alterations / Fabric Store' }}
              />
            </Section>
            <Section
              title="Supermarkets/Shopping"
              subTitle="Find Supermarkets and Grocery Stores"
              onViewAll={() =>
                onBusinessesViewAllPress({
                  title: 'Supermarkets/Shopping',
                  category: 'Supermarkets/Shopping',
                })
              }
              isLoading={false}>
              <HorizontalBusinesses
                onPress={onBusinessPress}
                queryKey={[BusinessesQueryKeysWithFav.supermarketsShopping]}
                params={{ category: 'Supermarkets/Shopping' }}
              />
            </Section>
            <Section
              title="Recently Added Businesses"
              subTitle="Lets find out what's new"
              onViewAll={() =>
                onBusinessesViewAllPress({
                  title: 'Recently Added Businesses',
                  recent: true,
                })
              }
              isLoading={false}>
              <VerticalBusinesses
                onPress={onBusinessPress}
                queryKey={['recent-businesses']}
                params={{ recent: true }}
              />
            </Section>
            <Section
              title="Popular Businesses"
              subTitle="Lets find out in which business people taking interest."
              onViewAll={() =>
                onBusinessesViewAllPress({
                  title: 'Popular Businesses',
                  popular: true,
                })
              }
              isLoading={false}>
              <VerticalBusinesses
                onPress={onBusinessPress}
                queryKey={['popular-businesses']}
                params={{ popular: true }}
              />
            </Section>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

export default memo(DashboardScreen);

const styles = StyleSheet.create({
  helplineButton: {
    width: 80,
    paddingHorizontal: 10,
    height: 25,
  },
  helplineButtonText: {
    marginLeft: 5,
    fontSize: 10,
  },
  serviceItem: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 15,
  },
  serviceCircleIcon: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    marginBottom: 5,
  },
  newFeature: {
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 45,
    justifyContent: 'center', //Centered horizontally
    alignItems: 'center', //Centered vertically
    flex: 1,
  },
  contentHeader: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  doc: {
    width: 10,
    height: 10,
    borderRadius: 8,
    borderWidth: 1,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  iconContainer: {
    width: 20,
    height: 20,
  },
  contentSearch: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  lineForm: {
    width: 1,
    height: '100%',
    margin: 10,
  },
  banner: {
    height: Utils.scaleWithPixel(110),
    width: '100%',
    borderRadius: 10,
  },
  contentBannerTopLeft: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  bannerButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  contentActionModalBottom: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  bannerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  bannerText: {
    marginTop: 5,
  },
});
