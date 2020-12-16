import React, {Fragment, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ScrollView,
  Animated,
  TouchableOpacity,
  Linking,
  Alert,
  FlatList, ActivityIndicator,
} from 'react-native';
import { BaseColor, Images, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  StarRating,
  Tag,
  Image,
} from '@components';
import { useTranslation } from 'react-i18next';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Utils from '@utils';
import styles from './styles';
import moment from 'moment';
import PlaceItem from "../PlaceItem";
import CardList from "../CardList";
import {useSelector, useDispatch} from "react-redux";
import {getAllBusinesses, getBusinesses} from "../../actions/business";

let defaultDelta = {
  latitudeDelta: 0.003,
  longitudeDelta: 0.003,
};

export default function PlaceDetailComponent(props) {
  const mapRef = useRef();
  const { t } = useTranslation();
  const deltaY = new Animated.Value(0);
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const { navigation, business } = props;

  const stateProps = useSelector(({businesses}) => {
    return {
      recentlyAddedBusinesses: businesses.recentlyAddedBusinesses,
      getRecentlyAddedBusinessesLoading: businesses.getRecentlyAddedBusinessesLoading,
      relatedBusiness: businesses.allBusinesses,
      getRelatedBusinessesLoading: businesses.getAllBusinessesLoading,
    }
  });

  useEffect(() => {
    dispatch(getAllBusinesses({limit: 5, skip: 0, fields:'name,category,averageRatings', category: business.category}));
    dispatch(getBusinesses({limit: 5, skip: 0, fields:'name,image,category,address,averageRatings'}));
  }, []);

  const navigateBusinessDetail = (id) => {
    navigation.navigate('PlaceDetail', {id})
  }

  const [isPreview] = useState(!business.preview);

  const [collapseHour, setCollapseHour] = useState(true);
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const [information] = useState([
    {
      id: '1',
      icon: 'map-marker-alt',
      title: t('address'),
      type: 'map',
      information: business.address,
    },
    {
      id: '2',
      icon: 'mobile-alt',
      title: t('tel'),
      type: 'phone',
      information: business.telephone,
    },
    {
      id: '3',
      icon: 'envelope',
      title: t('email'),
      type: 'email',
      information: business.email ? business.email : '',
    },
    {
      id: '4',
      icon: 'globe',
      title: t('website'),
      type: 'web',
      information: business.website ? business.website : '',
    },
  ]);

  const onOpen = (item) => {
    Alert.alert(
        'Explore BTK',
        `${t('do_you_want_open')} ${item.title} ?`,
        [
          {
            text: t('cancel'),
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: t('done'),
            onPress: () => {
              switch (item.type) {
                case 'web':
                  Linking.openURL(item.information);
                  break;
                case 'phone':
                  Linking.openURL('tel://' + item.information);
                  break;
                case 'email':
                  Linking.openURL('mailto:' + item.information);
                  break;
                case 'map':
                  Linking.openURL(
                      'http://maps.apple.com/?ll=37.484847,-122.148386',
                  );
                  break;
              }
            },
          },
        ],
        { cancelable: true },
    );
  };

  const [facilities] = useState([
    { id: '1', icon: 'wifi', name: 'Free Wifi', checked: true },
    { id: '2', icon: 'bath', name: 'Shower' },
    { id: '3', icon: 'paw', name: 'Pet Allowed' },
    { id: '4', icon: 'bus', name: 'Shuttle Bus' },
    { id: '5', icon: 'cart-plus', name: 'Supper Market' },
    { id: '6', icon: 'clock', name: 'Open 24/7' },
  ]);

  const [region, setRegion] = useState({
    latitude: 1.352083,
    longitude: 103.819839,
    latitudeDelta: 0.009,
    longitudeDelta: 0.004,
  });
  const [location, setLocation] = useState({
    latitude: 1.352083,
    longitude: 103.819839,
    latitudeDelta: 0.009,
    longitudeDelta: 0.004,
  });

  const reCenterMap = (currentLocation) => {
    mapRef.current.animateToRegion({
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      latitudeDelta: defaultDelta.latitudeDelta,
      longitudeDelta: defaultDelta.longitudeDelta,
    });
  };

  useEffect(() => {
    let loc =  business.location && business.location.coordinates ? business.location.coordinates : null
    if(loc){
      const payload = {
        latitude: loc[0],
        longitude: loc[1],
        ...defaultDelta,
      };
      setLocation(payload);
      setRegion(payload);
      reCenterMap(payload);
    }
  }, []);

  const onCollapse = () => {
    Utils.enableExperimental();
    setCollapseHour(!collapseHour);
  };

  const heightImageBanner = Utils.scaleWithPixel(250, 1);
  return (
      <View style={{ flex: 1 }}>
        <Animated.View
            style={[
              styles.imgBanner,
              {
                height: deltaY.interpolate({
                  inputRange: [
                    0,
                    Utils.scaleWithPixel(140),
                    Utils.scaleWithPixel(140),
                  ],
                  outputRange: [heightImageBanner, heightHeader, heightHeader],
                }),
              },
            ]}>
          <Image source={Images.location7} style={{ flex: 1 }} />
          {/*<Animated.View*/}
          {/*    style={{*/}
          {/*      position: 'absolute',*/}
          {/*      bottom: 15,*/}
          {/*      left: 20,*/}
          {/*      flexDirection: 'row',*/}
          {/*      opacity: deltaY.interpolate({*/}
          {/*        inputRange: [*/}
          {/*          0,*/}
          {/*          Utils.scaleWithPixel(140),*/}
          {/*          Utils.scaleWithPixel(140),*/}
          {/*        ],*/}
          {/*        outputRange: [1, 0, 0],*/}
          {/*      }),*/}
          {/*    }}>*/}
          {/*  <Image source={Images.profile2} style={styles.userIcon} />*/}
          {/*  <View>*/}
          {/*    <Text headline semibold whiteColor>*/}
          {/*      Publisher Name*/}
          {/*    </Text>*/}
          {/*    <Text footnote whiteColor>*/}
          {/*      {moment(business.createdAt).format('DD/MM/YYYY')} | {business.views} {t('views')}*/}
          {/*    </Text>*/}
          {/*  </View>*/}
          {/*</Animated.View>*/}
        </Animated.View>
        <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always' }}>
          {/* Header */}
          <Header
              title="Place Detail"
              renderLeft={() => {
                return isPreview ? null : (
                    <Icon name="arrow-left" size={20} color={BaseColor.whiteColor} />
                );
              }}
              renderRight={() => {
                return (
                    <Icon name="images" size={20} color={BaseColor.whiteColor} />
                );
              }}
              onPressLeft={() => {
                navigation.goBack();
              }}
              onPressRight={() => {
                navigation.navigate('PreviewImage');
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
            <View style={{ height: 255 - heightHeader }} />
            <View style={{paddingHorizontal: 20, marginBottom: 20}}>
              <View style={styles.lineSpace}>
                <Text title1 semibold>
                  {business.name}
                </Text>
                {isPreview ? null : <Icon name="heart" color={colors.primaryLight} size={24} />}
              </View>
              <View style={styles.lineSpace}>
                <View>
                  <Text caption1 grayColor>
                    {business.category}
                  </Text>
                  {isPreview ? (
                      <TouchableOpacity style={styles.rateLine}>
                        <Tag rateSmall style={{ marginRight: 5 }}>
                          0.0
                        </Tag>
                        <StarRating
                            disabled={true}
                            starSize={10}
                            maxStars={5}
                            rating={0}
                            fullStarColor={BaseColor.yellowColor}
                            on
                        />
                      </TouchableOpacity>
                  ) : (
                      <TouchableOpacity
                          style={styles.rateLine}
                          onPress={() => navigation.navigate('Review')}>
                        <Tag
                            rateSmall
                            style={{ marginRight: 5 }}
                            // onPress={() => navigation.navigate('Review')}
                        >
                          {business.averageRatings ? business.averageRatings : '0.0'}
                        </Tag>
                        <StarRating
                            disabled={true}
                            starSize={10}
                            maxStars={5}
                            rating={business.averageRatings}
                            fullStarColor={BaseColor.yellowColor}
                            on
                        />
                      </TouchableOpacity>
                  )}
                </View>
                {isPreview ? null : <Tag status>{t('featured')}</Tag>}
              </View>
              {information.map((item) => {
                if(item.information){
                  return (
                      <TouchableOpacity
                          style={styles.line}
                          key={item.id}
                          onPress={() => onOpen(item)}>
                        <View
                            style={[
                              styles.contentIcon,
                              { backgroundColor: colors.border },
                            ]}>
                          <Icon
                              name={item.icon}
                              size={16}
                              color={BaseColor.whiteColor}
                          />
                        </View>
                        <View style={{ marginLeft: 10 }}>
                          <Text caption2 grayColor>
                            {item.title}
                          </Text>
                          <Text footnote semibold style={{ marginTop: 5 }}>
                            {item.information}
                          </Text>
                        </View>
                      </TouchableOpacity>
                  );
                }
              })}
              {business.openHours && business.openHours.length ? <Fragment>
                <TouchableOpacity style={styles.line} onPress={onCollapse}>
                  <View style={[styles.contentIcon, {backgroundColor: colors.border}]}>
                    <Icon name="clock" size={16} color={BaseColor.whiteColor} />
                  </View>
                  <View style={styles.contentInforAction}>
                    <View>
                      <Text caption2 grayColor> {t('open_hour')} </Text>
                      <Text footnote semibold style={{ marginTop: 5 }}>
                        {business.openHours[0].from ? business.openHours[0].from : ''} -
                        {business.openHours[0].to ? business.openHours[0].to : ''}
                      </Text>
                    </View>
                    <Icon
                        name={collapseHour ? 'angle-up' : 'angle-down'}
                        size={24}
                        color={BaseColor.grayColor}
                    />
                  </View>
                </TouchableOpacity>
                {business.openHours.length > 1 ? <View
                    style={{
                      paddingLeft: 40,
                      paddingRight: 20,
                      marginTop: 5,
                      height: collapseHour ? 0 : null,
                      overflow: 'hidden',
                    }}>
                  {business.openHours.map((item) => {
                    return (
                        <View style={[styles.lineWorkHours, { borderColor: colors.border }]} key={item.day}>
                          <Text body2 grayColor>{item.day}</Text>
                          <Text body2 accentColor semibold>
                            {item.from ? item.from : ''}
                            {!(item.from || item.to) ? 'Close' : ''}
                            {(item.from && item.to) ? ' - ' : ''}
                            {item.to ? item.to : ''}
                          </Text>
                        </View>
                    );
                  })}
                </View> : null}
              </Fragment>: null}

            </View>
            <View style={[styles.contentDescription, { borderColor: colors.border }]}>
              {business.description ? <Text body2 style={{ lineHeight: 20 }}>
                {business.description}
              </Text> : null}
              <View
                  style={{
                    paddingVertical: 20,
                    flexDirection: 'row',
                  }}>
                {business.established ? <View style={{ flex: 1 }}>
                  <Text caption1 grayColor>
                    {t('date_established')}
                  </Text>
                  <Text headline style={{ marginTop: 5 }}>
                    {moment(business.established).format('DD/MM/YYYY')}
                  </Text>
                </View> : null}
                {business.priceRange && (business.priceRange.from || business.priceRange.to) ?
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                      <Text caption1 grayColor>{t('price_range')}</Text>
                      <Text headline style={{ marginTop: 5 }}>
                        {business.priceRange.from ? `${business.priceRange.from}` : ''}
                        {business.priceRange.to ? ` - ${business.priceRange.to}` : ''}
                      </Text>
                    </View> : null}
              </View>
              <View
                  style={{
                    height: 180,
                    paddingVertical: 20,
                  }}>
                <MapView
                    ref={mapRef}
                    scrollEnabled={false}
                    pitchEnabled={false}
                    zoomEnabled={false}
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    region={region}
                    onRegionChange={() => {}}>
                  <Marker
                      coordinate={location}
                  />
                </MapView>
              </View>
            </View>
            <Text
                title3
                semibold
                style={{
                  paddingHorizontal: 20,
                  paddingBottom: 5,
                  paddingTop: 15,
                }}>
              {t('facilities')}
            </Text>
            <View style={[styles.wrapContent, { borderColor: colors.border }]}>
              {facilities.map((item) => {
                return (
                    <Tag
                        icon={
                          <Icon
                              name={item.icon}
                              size={12}
                              color={colors.accent}
                              solid
                              style={{ marginRight: 5 }}
                          />
                        }
                        chip
                        key={item.id}
                        style={{
                          marginTop: 8,
                          marginRight: 8,
                        }}>
                      {item.name}
                    </Tag>
                );
              })}
            </View>
            {isPreview ? null : (
                <View>
                  <Text
                      title3
                      semibold
                      style={{
                        paddingHorizontal: 20,
                        paddingVertical: 15,
                      }}>
                    Recently Added
                  </Text>
                  {stateProps.getRecentlyAddedBusinessesLoading ? (
                      <ActivityIndicator size="small" color={colors.primary}/>
                  ) : (
                      <FlatList
                          contentContainerStyle={{paddingLeft: 5, paddingRight: 20}}
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}
                          data={stateProps.recentlyAddedBusinesses}
                          keyExtractor={(item, index) => item._id}
                          renderItem={({item, index}) => (
                              <PlaceItem
                                  grid
                                  image={item.image}
                                  title={item.name}
                                  subtitle={item.category}
                                  location={item.address}
                                  rate={item.averageRatings}
                                  status='Open Now'
                                  onPress={() => navigateBusinessDetail(item._id)}
                                  style={{marginLeft: 15, width: 175}}
                              />
                          )}
                      />
                  )}
                  <Text
                      title3
                      semibold
                      style={{
                        paddingHorizontal: 20,
                        paddingVertical: 15,
                      }}>
                    {t('related')}
                  </Text>
                  {stateProps.getRelatedBusinessesLoading ? (
                      <ActivityIndicator size="small" color={colors.primary}/>
                  ) : (
                      <FlatList
                          contentContainerStyle={{
                            paddingHorizontal: 20,
                          }}
                          data={stateProps.relatedBusiness}
                          keyExtractor={(item, index) => item._id}
                          renderItem={({item, index}) => (
                              <CardList
                                  image={item.image}
                                  title={item.name}
                                  subtitle={item.category}
                                  rate={item.averageRatings ? item.averageRatings : '0.0'}
                                  style={{marginBottom: 15}}
                                  onPress={() => navigateBusinessDetail(item._id)}
                              />
                          )}
                      />
                  )}
                </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
  );
}

PlaceDetailComponent.propTypes = {
  business: PropTypes.object,
};

PlaceDetailComponent.defaultProps = {
  business: {},
};
