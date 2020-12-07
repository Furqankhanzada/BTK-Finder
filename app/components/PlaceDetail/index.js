import React, { useState } from 'react';
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

export default function PlaceDetailComponent(props) {
  const { t } = useTranslation();
  const deltaY = new Animated.Value(0);
  const { colors } = useTheme();

  const { business } = props;

  const [isPreview] = useState(business.preview);

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
      information: business.tel,
    },
    {
      id: '3',
      icon: 'envelope',
      title: t('email'),
      type: 'email',
      information: business.email,
    },
    {
      id: '4',
      icon: 'globe',
      title: t('website'),
      type: 'web',
      information: business.website,
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

  const [region] = useState({
    latitude: 1.352083,
    longitude: 103.819839,
    latitudeDelta: 0.009,
    longitudeDelta: 0.004,
  });

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
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 15,
            left: 20,
            flexDirection: 'row',
            opacity: deltaY.interpolate({
              inputRange: [
                0,
                Utils.scaleWithPixel(140),
                Utils.scaleWithPixel(140),
              ],
              outputRange: [1, 0, 0],
            }),
          }}
        />
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
          <View
            style={{
              paddingHorizontal: 20,
              marginBottom: 20,
            }}>
            <View style={styles.lineSpace}>
              <Text title1 semibold>
                {business.title}
              </Text>
              <Icon name="heart" color={colors.primaryLight} size={24} />
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
                    <Text footnote grayColor style={{ marginLeft: 5 }}>
                      (0)
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.rateLine}
                    onPress={() => navigation.navigate('Review')}>
                    <Tag
                      rateSmall
                      style={{ marginRight: 5 }}
                      onPress={() => navigation.navigate('Review')}>
                      4.5
                    </Tag>
                    <StarRating
                      disabled={true}
                      starSize={10}
                      maxStars={5}
                      rating={4.5}
                      fullStarColor={BaseColor.yellowColor}
                      on
                    />
                    <Text footnote grayColor style={{ marginLeft: 5 }}>
                      (609)
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              {isPreview ? null : <Tag status>{t('featured')}</Tag>}
            </View>
            {information.map((item) => {
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
            })}
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
                    {t('open_hour')}
                  </Text>
                  <Text footnote semibold style={{ marginTop: 5 }}>
                    {business.timings && business.timings[0].from} -
                    {business.timings && business.timings[0].to}
                  </Text>
                </View>
                <Icon
                  name={collapseHour ? 'angle-up' : 'angle-down'}
                  size={24}
                  color={BaseColor.grayColor}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                paddingLeft: 40,
                paddingRight: 20,
                marginTop: 5,
                height: collapseHour ? 0 : null,
                overflow: 'hidden',
              }}>
              {business.timings &&
                business.timings.map((item) => {
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
                      <Text body2 accentColor semibold>
                        {item.from} - {item.to}
                      </Text>
                    </View>
                  );
                })}
            </View>
          </View>
          <View
            style={[styles.contentDescription, { borderColor: colors.border }]}>
            <Text body2 style={{ lineHeight: 20 }}>
              {business.description}
            </Text>
            <View
              style={{
                paddingVertical: 20,
                flexDirection: 'row',
              }}>
              <View style={{ flex: 1 }}>
                <Text caption1 grayColor>
                  {t('date_established')}
                </Text>
                <Text headline style={{ marginTop: 5 }}>
                  {business.dateEstablished}
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end' }}>
                <Text caption1 grayColor>
                  {t('price_range')}
                </Text>
                <Text headline style={{ marginTop: 5 }}>
                  PKR {business.priceFrom} - PKR {business.priceTo}
                </Text>
              </View>
            </View>
            <View
              style={{
                height: 180,
                paddingVertical: 20,
              }}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={region}
                onRegionChange={() => {}}>
                <Marker
                  coordinate={{
                    latitude: 1.352083,
                    longitude: 103.819839,
                  }}
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
