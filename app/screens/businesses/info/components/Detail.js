import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  ScrollView,
  Animated,
  Linking,
  Alert,
  Share,
  StyleSheet,
} from 'react-native';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { useTranslation } from 'react-i18next';
import Config from 'react-native-config';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { showLocation } from 'react-native-map-link';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import { Placeholder, Progressive, PlaceholderMedia } from 'rn-placeholder';

import { BaseColor, Images, useTheme, BaseStyle } from '@config';
import {
  PlaceDetailPlaceholder,
  Header,
  SafeAreaView,
  Icon,
  Text,
  Tag,
  Image,
} from '@components';
import * as Utils from '@utils';

import OverviewCard from '@screens/businesses/info/components/OverviewCard';
import ContactInfo from '@screens/businesses/info/components/ContactInfo';
import OpenHours from '@screens/businesses/info/components/OpenHours';
import Recommendations from '@screens/businesses/info/components/Recommendations';

import { trackEvent, EVENTS } from '../../../../userTracking';

let defaultDelta = {
  latitudeDelta: 0.003,
  longitudeDelta: 0.003,
};

export default function PlaceDetailComponent(props) {
  const mapRef = useRef();
  const scrollY = useRef(new Animated.Value(0)).current;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { navigation, business, isLoading, preview: isPreview } = props;
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const [businessLink, setBusinessLink] = useState('');
  const appLink = 'http://onelink.to/xwhffr';

  useEffect(() => {
    async function businessUrl() {
      const fallbackUrl = `${Config.ADMIN_URL}/businesses/${business._id}?publicView=true`;

      const link = await dynamicLinks().buildShortLink({
        link: fallbackUrl,
        domainUriPrefix: Config.DYNAMIC_LINK_URL,
        android: {
          packageName: 'com.explore.btk',
          fallbackUrl,
        },
        ios: {
          bundleId: 'com.explore.btk',
          fallbackUrl,
        },
      });
      setBusinessLink(link);
    }
    businessUrl();
  }, [business._id]);

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

  const onShare = async () => {
    try {
      await Share.share({
        message: `${business.name}: ${businessLink} \n \nDownload Explore BTK: ${appLink}`,
        url: businessLink,
        title: business.name,
        dialogTitle: business.name,
      });
      trackEvent(EVENTS.SHARE_BUTTON_CLICKED, {
        businessId: business._id,
        title: business.name,
        url: businessLink,
      });
    } catch (error) {
      console.log('Error while sharing Business', error.message);
    }
  };

  // const navigateBusinessDetail = (id) => {
  //   navigation.replace('BusinessDetailTabNavigator', { id });
  // };
  //
  // const navigateToReview = () => {
  //   navigation.navigate('Reviews');
  // };

  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, 140],
    outputRange: [BaseColor.whiteColor, colors.text],
    extrapolate: 'clamp',
    useNativeDriver: true,
  });

  const headerImageOpacity = scrollY.interpolate({
    inputRange: [0, 250 - heightHeader - 20],
    outputRange: [1, 0],
    extrapolate: 'clamp',
    useNativeDriver: true,
  });

  const heightViewImg = scrollY.interpolate({
    inputRange: [0, 250 - heightHeader],
    outputRange: [250, heightHeader],
    useNativeDriver: true,
  });

  const openGps = (item) => {
    showLocation({
      latitude: item?.location[0],
      longitude: item?.location[1],
      title: item.name, // optional
      googleForceLatLon: true, // optionally force GoogleMaps to use the latlon for the query instead of the title
      alwaysIncludeGoogle: true, // optional, true will always add Google Maps to iOS and open in Safari, even if app is not installed (default: false)
      appsWhiteList: ['google-maps'], // optionally you can set which apps to show (default: will show all supported apps installed on device)
      appTitles: { 'google-maps': item.name }, // optionally you can override default app titles
    });
  };

  const businessDetails = {
    id: business?._id,
    name: business?.name,
  };

  const onOpen = (item) => {
    Alert.alert(
      'Explore BTK',
      `${t('do_you_want_to')} ${item.rightText} ?`,
      [
        {
          text: t('cancel'),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: t('yes'),
          onPress: () => {
            switch (item.type) {
              case 'web':
                Linking.openURL(item.information);
                trackEvent(EVENTS.VISITED_BUSINESS_WEBSITE, {
                  ...businessDetails,
                  website: item.information,
                });
                break;
              case 'phone':
                Linking.openURL('tel://' + item.information);
                trackEvent(EVENTS.CONTACTED_BUSINESS_VIA_PHONE_NUMBER, {
                  ...businessDetails,
                  phone: item.information,
                });
                break;
              case 'email':
                Linking.openURL('mailto:' + item.information);
                trackEvent(EVENTS.CONTACTED_BUSINESS_VIA_EMAIL, {
                  ...businessDetails,
                  email: item.information,
                });
                break;
              case 'whatsapp':
                Linking.openURL(
                  'whatsapp://send?phone=' + checkPhoneCode(item.information),
                );
                trackEvent(EVENTS.CONTACTED_BUSINESS_VIA_WHATSAPP, {
                  ...businessDetails,
                  whatsapp: item.information,
                });
                break;
              case 'map':
                openGps(item);
                trackEvent(EVENTS.CHECKED_BUSINESS_DIRECTION, {
                  ...businessDetails,
                });
                break;
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const checkPhoneCode = (phone) => {
    if (business?.telephone?.includes('03')) {
      return `+92${phone.slice(1)}`;
    }

    return phone;
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

  const getCoverImage = useCallback(() => {
    if (business.gallery && business.gallery.length) {
      return business.gallery.find((image) => image?.cover)?.image;
    } else {
      return Images.imagePlaceholder;
    }
  }, [business]);

  const renderBanner = () => {
    if (isLoading) {
      return (
        <Placeholder Animation={Progressive}>
          <PlaceholderMedia style={{ width: '100%', height: '100%' }} />
        </Placeholder>
      );
    }

    return <Image source={getCoverImage()} style={{ flex: 1 }} />;
  };

  const onPressWhatsApp = () => {
    onOpen({
      title: t('tel'),
      type: 'whatsapp',
      information: business?.telephone,
      rightText: 'open WhatsApp',
    });
  };

  const onPressPhone = () => {
    onOpen({
      title: t('tel'),
      type: 'phone',
      information: business?.telephone,
      rightText: 'call',
    });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={{ paddingHorizontal: 20 }}>
          <PlaceDetailPlaceholder />
        </View>
      );
    }

    return (
      <View>
        <View style={{ paddingHorizontal: 20 }}>
          <OverviewCard business={business} isPreview={isPreview} />
          <ContactInfo
            business={business}
            onPressWhatsApp={onPressWhatsApp}
            onPressPhone={onPressPhone}
            onOpen={onOpen}
          />
          <OpenHours business={business} />
          <View
            style={[styles.contentDescription, { borderColor: colors.border }]}>
            {business.description ? (
              <Text body2 numberOfLines={100} style={{ lineHeight: 20 }}>
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
                scrollEnabled={true}
                pitchEnabled={false}
                zoomEnabled={true}
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
                  paddingBottom: 5,
                  paddingTop: 15,
                }}>
                {t('facilities')}
              </Text>
              <View
                style={[styles.wrapContent, { borderColor: colors.border }]}>
                {business?.facilities?.map((item, index) => {
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
                      key={item.name + index}
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
        </View>
        {!isPreview ? <Recommendations business={business} /> : null}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={BaseStyle.safeAreaView} edges={['left', 'right']}>
        <Animated.View
          style={[
            styles.headerImageStyle,
            {
              opacity: headerImageOpacity,
              height: heightViewImg,
            },
          ]}>
          {renderBanner()}
        </Animated.View>
        <Animated.View style={[styles.headerStyle]}>
          <Header
            title={isPreview ? 'Business Review' : ''}
            renderLeft={() => {
              return (
                <Animated.Image
                  resizeMode="contain"
                  style={[
                    styles.icon,
                    {
                      tintColor: headerBackgroundColor,
                    },
                  ]}
                  source={Images.back}
                />
              );
            }}
            renderRightSecond={() => {
              return (
                <View style={styles.iconContent}>
                  <Animated.Image
                    resizeMode="contain"
                    style={[
                      styles.icon,
                      {
                        tintColor: headerBackgroundColor,
                      },
                    ]}
                    source={Images.gallery}
                  />
                </View>
              );
            }}
            renderRight={
              isPreview
                ? null
                : () => {
                    return (
                      <View style={styles.iconContent}>
                        <Animated.Image
                          resizeMode="contain"
                          style={[
                            styles.icon,
                            {
                              tintColor: headerBackgroundColor,
                            },
                          ]}
                          source={Images.share}
                        />
                      </View>
                    );
                  }
            }
            onPressLeft={() => {
              navigation.goBack();
            }}
            onPressRight={() => onShare()}
            onPressRightSecond={() => {
              navigation.navigate('PreviewImage', {
                title: business.name,
                gallery: business.gallery,
              });
              trackEvent(EVENTS.SEE_MORE_IMAGES, { title: business.name });
            }}
          />
        </Animated.View>
        <ScrollView
          onContentSizeChange={() => {
            setHeightHeader(Utils.heightHeader());
          }}
          overScrollMode={'never'}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: { y: scrollY },
                },
              },
            ],
            {
              useNativeDriver: false,
            },
          )}>
          <View style={{ height: 170 - heightHeader }} />
          {renderContent()}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

PlaceDetailComponent.propTypes = {
  isLoading: PropTypes.bool,
  business: PropTypes.object,
  navigation: PropTypes.object,
};

PlaceDetailComponent.defaultProps = {
  business: {},
};

const styles = StyleSheet.create({
  headerStyle: {
    height: 'auto',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerImageStyle: {
    height: 250,
    width: '100%',
    top: 0,
    alignSelf: 'center',
    position: 'absolute',
    paddingBottom: 20,
  },
  iconContent: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BaseColor.dividerColor,
  },
  icon: {
    width: 18,
    height: 18,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  wrapContent: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 20,
  },
  contentDescription: {
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 0.5,
  },
  priceRangeSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  prices: {
    display: 'flex',
    flexDirection: 'row',
  },
});
