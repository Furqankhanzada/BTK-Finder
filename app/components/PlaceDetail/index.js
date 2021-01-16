import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ScrollView,
  Animated,
  TouchableOpacity,
  Linking,
  Alert,
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
import PlaceItem from '../PlaceItem';
import CardList from '../CardList';
import { useSelector, useDispatch } from 'react-redux';
import {
  getRalatedBusinesses,
  getBusinesses,
  toggleFavorite,
} from '../../actions/business';
import SectionList from '../../screens/Home/sectionList';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import NumberFormat from 'react-number-format';

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

  const stateProps = useSelector(({ businesses }) => {
    return {
      recentlyAddedBusinesses: businesses.placeDetailRecentlyAddedBusinesses,
      getRecentlyAddedBusinessesLoading:
        businesses.placeDetailRecentlyAddedBusinessesLoading,
      relatedBusiness: businesses.relatedBusinesses,
      getRelatedBusinessesLoading: businesses.getRelatedBusinessesLoading,
      favoriteIds: businesses.favoriteIds,
    };
  });

  useEffect(() => {
    dispatch(
      getRalatedBusinesses({
        limit: 5,
        skip: 0,
        fields: 'name, thumbnail, category, averageRatings',
        category: business.category,
      }),
    );
    dispatch(
      getBusinesses({
        placeDetail: true,
        limit: 5,
        skip: 0,
        fields: 'name, thumbnail, category, address, averageRatings',
      }),
    );
  }, [business.category, dispatch]);

  const navigateBusinessDetail = (id) => {
    navigation.replace('PlaceDetail', { id });
  };
  const navigateToReview = (id) => {
    navigation.navigate('Review', { id });
  };

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
      location: business?.location?.coordinates,
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

  const openGps = (lat, lng) => {
    let company = Platform.OS === 'ios' ? 'apple' : 'google';
    let url = `http://maps.${company}.com/maps?daddr=${lat},${lng}`;
    Linking.openURL(url);
  };

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
                openGps(item?.location[0], item?.location[1]);
                break;
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

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
    mapRef?.current?.animateToRegion({
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      latitudeDelta: defaultDelta.latitudeDelta,
      longitudeDelta: defaultDelta.longitudeDelta,
    });
  };

  useEffect(() => {
    let loc =
      business.location && business.location.coordinates
        ? business.location.coordinates
        : null;
    if (loc) {
      const payload = {
        latitude: loc[0],
        longitude: loc[1],
        ...defaultDelta,
      };
      setLocation(payload);
      setRegion(payload);
      reCenterMap(payload);
    }
  }, [business.location]);

  const onCollapse = () => {
    Utils.enableExperimental();
    setCollapseHour(!collapseHour);
  };

  const favorite = (id) => {
    dispatch(toggleFavorite(id));
  };

  const updateOpenHours = (data) => {
    let array = [
      { day: 'Monday' },
      { day: 'Tuesday' },
      { day: 'Wednesday' },
      { day: 'Thursday' },
      { day: 'Friday' },
      { day: 'Saturday' },
      { day: 'Sunday' },
    ];
    if (data?.length) {
      array = data.concat(
        array.filter(({ day }) => !data.find((f) => f.day === day)),
      );
    }
    return array;
  };

  const heightImageBanner = Utils.scaleWithPixel(250, 1);

  const getCoverImage = useCallback(() => {
    if (business.gallery && business.gallery.length) {
      return business.gallery.find((image) => image.cover).image;
    } else {
      return Images.imagePlaceholder;
    }
  }, [business]);

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
        <Image source={getCoverImage()} style={{ flex: 1 }} />
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
          title=""
          renderLeft={() => {
            return isPreview ? null : (
              <Icon name="arrow-left" size={20} color={BaseColor.whiteColor} />
            );
          }}
          renderRight={
            business.gallery && business.gallery.length
              ? () => {
                  return (
                    <Icon
                      name="images"
                      size={20}
                      color={BaseColor.whiteColor}
                    />
                  );
                }
              : null
          }
          onPressLeft={() => {
            navigation.goBack();
          }}
          onPressRight={() => {
            navigation.navigate('PreviewImage', {
              title: business.name,
              gallery: business.gallery,
            });
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
          <View style={{ height: 280 - heightHeader }} />
          <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <View style={styles.lineSpace}>
              <Text title1 semibold>
                {business.name}
              </Text>
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
                    onPress={() => navigateToReview(business._id)}>
                    <Tag
                      rateSmall
                      style={{ marginRight: 5 }}
                      onPress={() => navigateToReview(business._id)}>
                      <NumberFormat
                        value={
                          business?.reviewStats?.averageRatings
                            ? business?.reviewStats?.averageRatings
                            : '0.0'
                        }
                        displayType={'text'}
                        decimalScale={1}
                        fixedDecimalScale={true}
                        renderText={(value) => (
                          <Text style={{ fontSize: 10, color: 'white' }}>
                            {value}
                          </Text>
                        )}
                      />
                    </Tag>
                    <StarRating
                      disabled={true}
                      starSize={10}
                      maxStars={5}
                      rating={business?.reviewStats?.averageRatings}
                      fullStarColor={BaseColor.yellowColor}
                      on
                    />
                    <Text footnote grayColor style={{ marginLeft: 5 }}>
                      ({business?.reviews?.length})
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {isPreview ? null : stateProps?.favoriteIds?.includes(
                  business._id,
                ) ? (
                <Icon2
                  onPress={() => favorite(business._id)}
                  name={'heart'}
                  color={colors.primaryLight}
                  size={24}
                />
              ) : (
                <Icon
                  onPress={() => favorite(business._id)}
                  name={'heart'}
                  color={colors.primaryLight}
                  size={24}
                />
              )}
            </View>
            {information.map((item) => {
              if (item.information) {
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
                    <View
                      style={{
                        marginLeft: 10,
                        flexDirection: 'column',
                        flex: 1,
                      }}>
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
            {business?.openHours && business?.openHours?.length ? (
              <Fragment>
                <TouchableOpacity style={styles.line} onPress={onCollapse}>
                  <View
                    style={[
                      styles.contentIcon,
                      { backgroundColor: colors.border },
                    ]}>
                    <Icon name="clock" size={16} color={BaseColor.whiteColor} />
                  </View>
                  <View style={styles.contentInforAction}>
                    <View>
                      <Text caption2 grayColor>
                        {' '}
                        {t('open_hour')}{' '}
                      </Text>
                      <Text footnote semibold style={{ marginTop: 5 }}>
                        {business.openHours[0].from
                          ? business.openHours[0].from.toLowerCase()
                          : ''}
                        {' - '}
                        {business.openHours[0].to
                          ? business.openHours[0].to.toLowerCase()
                          : ''}
                      </Text>
                    </View>
                    <Icon
                      name={collapseHour ? 'angle-down' : 'angle-up'}
                      size={24}
                      color={BaseColor.grayColor}
                    />
                  </View>
                </TouchableOpacity>
                {business?.openHours?.length > 1 ? (
                  <View
                    style={{
                      paddingLeft: 40,
                      paddingRight: 20,
                      marginTop: 5,
                      height: collapseHour ? 0 : null,
                      overflow: 'hidden',
                    }}>
                    {updateOpenHours(business.openHours).map((item) => {
                      return (
                        <View
                          style={[
                            styles.lineWorkHours,
                            { borderColor: colors.border },
                          ]}
                          key={item.day}>
                          <Text body2 grayColor>
                            {item.day}
                          </Text>
                          {'isOpen' in item && !item.isOpen ? (
                            <Text body2 accentColor semibold>
                              {' '}
                              Close{' '}
                            </Text>
                          ) : (
                            <Text body2 accentColor semibold>
                              {item.from ? item.from.toLowerCase() : ''}
                              {!(item.isOpen || item.from || item.to)
                                ? 'Close'
                                : ''}
                              {item.from && item.to ? ' - ' : ''}
                              {item.to ? item.to.toLowerCase() : ''}
                            </Text>
                          )}
                        </View>
                      );
                    })}
                  </View>
                ) : null}
              </Fragment>
            ) : null}
          </View>
          <View
            style={[styles.contentDescription, { borderColor: colors.border }]}>
            {business.description ? (
              <Text body2 numberOfLines={30} style={{ lineHeight: 20 }}>
                {business.description}
              </Text>
            ) : null}
            <View
              style={{
                paddingVertical: 20,
                flexDirection: 'row',
              }}>
              {business.established ? (
                <View style={{ flex: 1 }}>
                  <Text caption1 grayColor>
                    {t('date_established')}
                  </Text>
                  <Text headline style={{ marginTop: 5 }}>
                    {moment(business.established).format('DD/MM/YYYY')}
                  </Text>
                </View>
              ) : null}
              {business.priceRange &&
              (business.priceRange.from || business.priceRange.to) ? (
                <View style={styles.priceRangeSection}>
                  <Text caption1 grayColor>
                    {t('price_range')}
                  </Text>
                  <View style={styles.prices}>
                    <NumberFormat
                      value={
                        business.priceRange.from
                          ? `${business.priceRange.from}`
                          : ''
                      }
                      displayType={'text'}
                      prefix={' RS '}
                      thousandSeparator={true}
                      renderText={(value) => (
                        <Text headline style={{ marginTop: 5 }}>
                          {value} -
                        </Text>
                      )}
                    />
                    <NumberFormat
                      value={
                        business.priceRange.to
                          ? `${business.priceRange.to}`
                          : ''
                      }
                      displayType={'text'}
                      prefix={' RS '}
                      thousandSeparator={true}
                      renderText={(value) => (
                        <Text headline style={{ marginTop: 5 }}>
                          {value}
                        </Text>
                      )}
                    />
                  </View>
                </View>
              ) : null}
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
                <Marker coordinate={location} />
              </MapView>
            </View>
          </View>
          {business?.facilities?.length ? (
            <View>
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
              <View
                style={[styles.wrapContent, { borderColor: colors.border }]}>
                {business?.facilities?.map((item) => {
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
                      {item?.name}
                    </Tag>
                  );
                })}
              </View>
            </View>
          ) : null}
          {isPreview ? null : (
            <View style={{ marginTop: 20 }}>
              <SectionList
                title="Recently Added"
                data={stateProps.recentlyAddedBusinesses}
                horizontal={true}
                loading={stateProps.getRecentlyAddedBusinessesLoading}
                renderItem={({ item, index }) => {
                  return (
                    <PlaceItem
                      grid
                      image={item?.thumbnail}
                      title={item.name}
                      subtitle={item.category}
                      location={item?.address}
                      rate={item?.averageRatings || '0.0'}
                      favoriteOnPress={() => favorite(item._id)}
                      isFavorite={stateProps?.favoriteIds?.includes(item._id)}
                      // status='Open Now'
                      onPress={() => navigateBusinessDetail(item._id)}
                      onPressTag={() => navigateToReview(item._id)}
                      style={{ marginLeft: 15, width: 175 }}
                    />
                  );
                }}
              />
              <SectionList
                title={t('related')}
                data={stateProps.relatedBusiness}
                loading={stateProps.getRelatedBusinessesLoading}
                renderItem={({ item, index }) => {
                  return (
                    <CardList
                      key={index}
                      image={item?.thumbnail}
                      title={item.name}
                      subtitle={item.category}
                      rate={item?.averageRatings || '0.0'}
                      style={{ marginBottom: 15 }}
                      onPress={() => navigateBusinessDetail(item._id)}
                      onPressTag={() => navigateToReview(item._id)}
                    />
                  );
                }}
              />
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
