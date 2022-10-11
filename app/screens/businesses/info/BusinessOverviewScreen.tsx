import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Alert,
  Animated,
  Linking,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { showLocation } from 'react-native-map-link';
import { useTranslation } from 'react-i18next';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Placeholder, PlaceholderMedia, Progressive } from 'rn-placeholder';
import ImageView from 'react-native-image-viewing';
import { StackScreenProps } from '@react-navigation/stack';

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
  ShopStatus,
} from '@screens/businesses/models/BusinessPresentable';
import OverviewCard from '@screens/businesses/info/components/OverviewCard';
import ContactInfo from '@screens/businesses/info/components/ContactInfo';
import OpenHours from '@screens/businesses/info/components/OpenHours';
import Recommendations from '@screens/businesses/info/components/Recommendations';
import Products from '@screens/businesses/components/Products';

import { useBusiness } from '../queries/queries';
import { useBuildBusinessURL } from '../queries/mutations';
import { EVENTS, trackEvent } from '../../../userTracking';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';

let defaultDelta = {
  latitudeDelta: 0.003,
  longitudeDelta: 0.003,
};

export default function BusinessOverviewScreen(
  props: StackScreenProps<GlobalParamList, 'Overview'>,
) {
  const { navigation, route } = props;

  const mapRef = useRef<any>();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [openGallery, setOpenGallery] = useState<boolean>(false);
  const [heightHeader, setHeightHeader] = useState(Utils.heightHeader());

  const { t } = useTranslation();
  const { colors } = useTheme();

  const { isLoading, data: business } = useBusiness(route?.params?.id);
  const {
    isLoading: businessLinkLoading,
    mutateAsync: buildBusinessURLMutate,
  } = useBuildBusinessURL();

  const appLink = 'http://onelink.to/xwhffr';

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
    if (!business?._id) {
      Alert.alert('Wait a minute', 'Please wait for the business to load');
      return;
    }
    const businessLink = await buildBusinessURLMutate(business?._id);
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

  const onNavigate = (routeName: keyof GlobalParamList, id?: string) => {
    const params: { id?: string } = {};
    if (id) {
      params.id = id;
    }
    navigation.navigate({
      name: routeName,
      params,
      key: params.id ? params.id : null,
    } as any);
  };

  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [BaseColor.whiteColor, colors.text],
    extrapolate: 'clamp',
  });

  const headerIconBackgroundColor = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [colors.primary, colors.background],
    extrapolate: 'clamp',
  });

  const headerImageOpacity = scrollY.interpolate({
    inputRange: [0, 150 - heightHeader - 20],
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
          <PlaceholderMedia style={styles.placeholderDiv} />
        </Placeholder>
      );
    }

    return <Image source={getCoverImage()} style={styles.coverImage} />;
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
    setOpenGallery(true);
    trackEvent(EVENTS.SEE_MORE_IMAGES, { title: business?.name });
  };

  const renderHeaderButton = (source: number, loading: boolean = false) => {
    return (
      <Animated.View
        style={[
          styles.iconContent,
          { backgroundColor: headerIconBackgroundColor },
        ]}>
        {loading ? (
          <ActivityIndicator size="small" color={colors.text} />
        ) : (
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
        )}
      </Animated.View>
    );
  };
  const renderContent = () => {
    if (isLoading || !business) {
      return (
        <View style={styles.renderContentDiv}>
          <PlaceDetailPlaceholder />
        </View>
      );
    }

    return (
      <View>
        <View style={styles.renderContentDiv}>
          <OverviewCard business={business} onNavigate={onNavigate} />
          <ContactInfo
            onNavigate={onNavigate}
            business={business}
            onPressWhatsApp={onPressWhatsApp}
            onPressPhone={onPressPhone}
            onOpen={onOpen}
          />
          <OpenHours business={business} />
        </View>

        {business?.shop && business.shop.status === ShopStatus.enabled ? (
          <View>
            <Text title3 semibold style={styles.facilities}>
              {business.type === 'restaurant' ? 'Menu' : 'Products'}
            </Text>
            <View style={[styles.wrapContent, { borderColor: colors.border }]}>
              <Products business={business} />
            </View>
          </View>
        ) : null}
        <View
          style={[styles.contentDescription, { borderColor: colors.border }]}>
          {business.description ? (
            <Text body2 numberOfLines={100} style={styles.contentInfo}>
              {business.description}
            </Text>
          ) : null}
          <View style={styles.contentContainer} />
          <View style={styles.contentSubContainer}>
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
            <Text title3 semibold style={styles.facilities}>
              {t('facilities')}
            </Text>
            <View style={[styles.wrapFacility, { borderColor: colors.border }]}>
              {business.facilities?.map((item, index) => {
                return (
                  <Tag
                    icon={
                      <Icon
                        name={item.icon}
                        size={12}
                        color={colors.accent}
                        solid
                        style={styles.facilityIcon}
                      />
                    }
                    chip
                    key={item.name + index}
                    style={styles.facilityText}>
                    {item?.name}
                  </Tag>
                );
              })}
            </View>
          </View>
        ) : null}

        <Recommendations business={business} onNavigate={onNavigate} />
      </View>
    );
  };

  const HIT_SLOP = { top: 16, left: 16, bottom: 16, right: 16 };

  return (
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
      <Header
        title={''}
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
        renderRight={() =>
          renderHeaderButton(Images.share, businessLinkLoading)
        }
        onPressLeft={navigation.goBack}
        onPressRight={onShare}
        onPressRightSecond={onPressGallery}
      />
      <ImageView
        backgroundColor={colors.background}
        images={business?.gallery?.map((item) => ({ uri: item.image })) || []}
        imageIndex={0}
        visible={openGallery}
        onRequestClose={() => setOpenGallery(false)}
        HeaderComponent={() => (
          <SafeAreaView style={styles.galleryHeader}>
            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: colors.card }]}
              onPress={() => setOpenGallery(false)}
              hitSlop={HIT_SLOP}>
              <Text style={[styles.closeText, { color: colors.text }]}>✕</Text>
            </TouchableOpacity>
          </SafeAreaView>
        )}
        FooterComponent={({ imageIndex }) => (
          <View
            style={[styles.galleryFooter, { backgroundColor: colors.card }]}>
            <Text
              style={[styles.galleryFooterText, { color: colors.text }]}>{`${
              imageIndex + 1
            } / ${business?.gallery?.length}`}</Text>
          </View>
        )}
      />
      <FlatList
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
        )}
        data={[1]}
        renderItem={() => {
          return (
            <Fragment>
              <View style={{ height: 170 - heightHeader }} />
              {renderContent()}
            </Fragment>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  wrapFacility: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  contentDescription: {
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 0.5,
    paddingHorizontal: 20,
  },
  galleryFooter: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryFooterText: {
    fontSize: 17,
  },
  galleryHeader: {
    alignItems: 'flex-end',
  },
  closeButton: {
    marginRight: 8,
    marginTop: 8,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  closeText: {
    lineHeight: 22,
    fontSize: 19,
    textAlign: 'center',
    includeFontPadding: false,
  },
  placeholderDiv: {
    width: '100%',
    height: '100%',
  },
  coverImage: {
    flex: 1,
  },
  renderContentDiv: {
    paddingHorizontal: 20,
  },
  contentInfo: {
    lineHeight: 20,
  },
  contentContainer: {
    paddingVertical: 20,
    flexDirection: 'row',
  },
  contentSubContainer: {
    height: 180,
    paddingVertical: 20,
  },
  facilities: {
    paddingBottom: 5,
    paddingTop: 15,
    paddingHorizontal: 20,
  },
  facilityIcon: {
    marginRight: 5,
  },
  facilityText: {
    marginTop: 8,
    marginRight: 8,
  },
});
