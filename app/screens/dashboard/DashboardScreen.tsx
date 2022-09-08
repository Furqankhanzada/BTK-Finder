import React, { useEffect } from 'react';
import { FlatList, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';

import { Header, SafeAreaView, Icon, Button, Text } from '@components';
import { BaseStyle, useTheme } from '@config';
import Section from '@screens/dashboard/components/Section';
import { CategoryPresentable } from '@screens/category/modals/CategoryPresentables';
import HorizontalCategories from '@screens/dashboard/components/HorizontalCategories';
import VerticalBusinesses from '@screens/dashboard/components/VerticalBusinesses';
import HorizontalBusinesses from '@screens/dashboard/components/HorizontalBusinesses';
import { BusinessPresentable } from '@screens/businesses/models/BusinessPresentable';
import { BusinessesQueryKeysWithFav } from '@screens/businesses/models/BusinessesQueryKeys';

import { EVENTS, setUser, trackEvent } from '../../userTracking';
import { GlobalParamList } from '../../navigation/models/GlobalParamList';
import { MainStackParamList } from '../../navigation/models/MainStackParamList';
import { getProfile } from '../../actions/auth';

export default function DashboardScreen({
  navigation,
}: StackScreenProps<GlobalParamList, 'Dashboard'>) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const dispatch = useDispatch();
  const isLogin = useSelector((state: any) => state.auth.isLogin);
  const profileData = useSelector((state: any) => state.profile);

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
    }
  }, [dispatch, isLogin]);

  const onPressHelpLine = () => {
    navigation.navigate('HelpLine');
    trackEvent(EVENTS.HELPLINE_SCREEN_VISITED);
  };

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
      id: business._id,
    });
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={'Explore BTK'}
        renderRight={() => {
          return (
            <Button
              styleText={styles.helplineButtonText}
              style={styles.helplineButton}
              icon={<Icon name={'phone'} size={10} color={'white'} solid />}
              full
              round
              onPress={onPressHelpLine}>
              {t('help_line')}
            </Button>
          );
        }}
      />
      <FlatList
        data={[1]}
        renderItem={() => (
          <View>
            <Section
              title="Upcoming Features"
              subTitle="These features are under development"
              onViewAll={() =>
                onBusinessesViewAllPress({
                  title: 'Restaurants with Menu Online',
                  tags: ['Menu'],
                })
              }
              isLoading={false}>
              <View
                style={[
                  {
                    flexDirection: 'row',
                    paddingHorizontal: 20,
                  },
                ]}>
                <TouchableOpacity
                  style={[
                    styles.newFeature,
                    {
                      backgroundColor: colors.card,
                      marginRight: 5,
                    },
                  ]}>
                  <Text headline semibold darkPrimaryColor textAlign="center">
                    Car Pooling
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.newFeature,
                    {
                      backgroundColor: colors.card,
                      marginRight: 5,
                    },
                  ]}>
                  <Text headline semibold darkPrimaryColor textAlign="center">
                    Deals
                  </Text>
                </TouchableOpacity>
              </View>
            </Section>
            <Section
              title="Browse by categories"
              onViewAll={onCategoriesViewAllPress}
              isLoading={false}>
              <HorizontalCategories onPress={onCategoryPress} />
            </Section>
            <Section
              title="Restaurant with Menus (New)"
              subTitle="Find Restaurant with Menus, Now you can see the prices and available food items"
              onViewAll={() =>
                onBusinessesViewAllPress({
                  title: 'Restaurants with Menu Online',
                  tags: ['Menu'],
                })
              }
              isLoading={false}>
              <HorizontalBusinesses
                onPress={onBusinessPress}
                queryKey={[BusinessesQueryKeysWithFav.restaurantsWithMenu]}
                params={{
                  tags: ['Menu'],
                  fields: ['_id', 'name', 'thumbnail', 'favorites'].join(','),
                }}
              />
            </Section>

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
            <Section
              title="Health & Fitness"
              subTitle="Find GYMs, Hospitals, Pharmacies"
              onViewAll={() =>
                onBusinessesViewAllPress({
                  title: 'Health & Fitness',
                  category: 'Education',
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
});
