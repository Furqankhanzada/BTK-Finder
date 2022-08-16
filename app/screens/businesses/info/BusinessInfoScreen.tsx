import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  View,
} from 'react-native';
import { showLocation } from 'react-native-map-link';
import { useTranslation } from 'react-i18next';
import Config from 'react-native-config';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Placeholder, PlaceholderMedia, Progressive } from 'rn-placeholder';

import {
  Header,
  Icon,
  Image,
  PlaceDetailPlaceholder,
  SafeAreaView,
  Tag,
  Text,
} from '@components';
import { BaseColor, BaseStyle, Images, useTheme } from '@config';
import * as Utils from '@utils';
import {
  ContactItem,
  ContactItemType,
} from '@screens/businesses/models/BusinessPresentable';
import OverviewCard from '@screens/businesses/info/components/OverviewCard';
import ContactInfo from '@screens/businesses/info/components/ContactInfo';
import OpenHours from '@screens/businesses/info/components/OpenHours';
import Recommendations from '@screens/businesses/info/components/Recommendations';

import { useBusiness } from '../queries/queries';
import { EVENTS, trackEvent } from '../../../userTracking';

let defaultDelta = {
  latitudeDelta: 0.003,
  longitudeDelta: 0.003,
};

interface Props {
  navigation: any;
  route: any;
  preview: boolean;
}

export default function BusinessInfoScreen(props: Props) {
  const { navigation, route, preview: isPreview } = props;
  const { isLoading, data: business } = useBusiness(route?.params?.id);
  const mapRef = useRef<any>();
  const scrollY = useRef(new Animated.Value(0)).current;
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());
  const [businessLink, setBusinessLink] = useState('');
  const appLink = 'http://onelink.to/xwhffr';

  useEffect(() => {
    async function businessUrl() {
      const fallbackUrl = `${Config.ADMIN_URL}/businesses/${business?._id}?publicView=true`;

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
  }, [business?._id]);

  useEffect(() => {
    let loc =
      business?.location && business.location.coordinates
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
  }, [business?.location]);

  const onShare = async () => {
    try {
      await Share.share({
        message: `${business?.name}: ${businessLink} \n \nDownload Explore BTK: ${appLink}`,
        url: businessLink,
        title: business?.name,
      });
      trackEvent(EVENTS.SHARE_BUTTON_CLICKED, {
        businessId: business?._id,
        title: business?.name,
        url: businessLink,
      });
    } catch (error: any) {
      console.log('Error while sharing Business', error.message);
    }
  };

  const onNavigate = (routeName: string, id?: string) => {
    const params: { id?: string } = {};
    if (id) {
      params.id = id;
    }
    navigation.navigate(routeName, params);
  };

  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, 140],
    outputRange: [BaseColor.whiteColor, colors.text],
    extrapolate: 'clamp',
  });

  const headerImageOpacity = scrollY.interpolate({
    inputRange: [0, 250 - heightHeader - 20],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const heightViewImg = scrollY.interpolate({
    inputRange: [0, 250 - heightHeader],
    outputRange: [250, heightHeader],
  });

  const openGps = (item: any) => {
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

  const onOpen = (item: ContactItem) => {
    const businessDetails = {
      id: business?._id,
      name: business?.name,
    };
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
              case ContactItemType.website:
                Linking.openURL(item.information || '');
                trackEvent(EVENTS.VISITED_BUSINESS_WEBSITE, {
                  ...businessDetails,
                  website: item.information,
                });
                break;
              case ContactItemType.phone:
                Linking.openURL('tel://' + item.information);
                trackEvent(EVENTS.CONTACTED_BUSINESS_VIA_PHONE_NUMBER, {
                  ...businessDetails,
                  phone: item.information,
                });
                break;
              case ContactItemType.email:
                Linking.openURL('mailto:' + item.information);
                trackEvent(EVENTS.CONTACTED_BUSINESS_VIA_EMAIL, {
                  ...businessDetails,
                  email: item.information,
                });
                break;
              case ContactItemType.whatsapp:
                Linking.openURL(
                  'whatsapp://send?phone=' +
                    checkPhoneCode(item.information || ''),
                );
                trackEvent(EVENTS.CONTACTED_BUSINESS_VIA_WHATSAPP, {
                  ...businessDetails,
                  whatsapp: item.information,
                });
                break;
              case ContactItemType.map:
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

  const checkPhoneCode = (phone: string) => {
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

  const reCenterMap = (currentLocation: any) => {
    mapRef?.current?.animateToRegion({
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      latitudeDelta: defaultDelta.latitudeDelta,
      longitudeDelta: defaultDelta.longitudeDelta,
    });
  };

  const getCoverImage = useCallback(() => {
    if (business?.gallery && business.gallery.length) {
      return business.gallery.find((image) => image.cover)?.image;
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
      id: '6',
      title: t('tel'),
      type: ContactItemType.whatsapp,
      information: business?.telephone,
      rightText: 'open WhatsApp',
    });
  };

  const onPressPhone = () => {
    onOpen({
      id: '5',
      title: t('tel'),
      type: ContactItemType.phone,
      information: business?.telephone,
      rightText: 'call',
    });
  };

  const onPressGallery = () => {
    navigation.navigate('PreviewImage', {
      title: business?.name,
      gallery: business?.gallery,
    });
    trackEvent(EVENTS.SEE_MORE_IMAGES, { title: business?.name });
  };

  const renderHeaderButton = (source: number, isInPreviewMode?: boolean) => {
    if (isInPreviewMode) {
      return null;
    }
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
          source={source}
        />
      </View>
    );
  };
  const renderContent = () => {
    if (isLoading || !business) {
      return (
        <View style={{ paddingHorizontal: 20 }}>
          <PlaceDetailPlaceholder />
        </View>
      );
    }

    return (
      <View>
        <View style={{ paddingHorizontal: 20 }}>
          <OverviewCard
            business={business}
            isPreview={isPreview}
            onNavigate={onNavigate}
          />
          <ContactInfo
            onNavigate={onNavigate}
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
              }}></View>
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
                {business.facilities?.map((item, index) => {
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
        {!isPreview ? (
          <Recommendations business={business} onNavigate={onNavigate} />
        ) : null}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={BaseStyle.safeAreaView}>
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
            renderRightSecond={() => renderHeaderButton(Images.gallery)}
            renderRight={() => renderHeaderButton(Images.share, isPreview)}
            onPressLeft={navigation.goBack}
            onPressRight={onShare}
            onPressRightSecond={onPressGallery}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
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
});
