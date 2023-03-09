import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import NumberFormat from 'react-number-format';

import { Images } from '@config';
import { Image, Text, StarRating, Tag, Icon, FavouriteIcon } from '@components';
import { BaseColor, useTheme } from '@config';

import { BusinessStatus } from '@screens/businesses/models/BusinessPresentable';
import styles from './styles';

export default function PlaceItem(props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const {
    grid,
    block,
    style,
    image,
    title,
    subtitle,
    location,
    phone,
    rate,
    status,
    rateStatus,
    numReviews,
    onPress,
    isFavorite,
    onPressTag,
    businessId,
    lastRoute,
    routeId,
  } = props;
  /**
   * Display place item as block
   */
  const renderBlock = () => {
    return (
      <View style={style}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
          <Image source={image} style={styles.blockImage} />
          {status ? (
            <Tag status style={styles.tagStatus}>
              {t(status)}
            </Tag>
          ) : null}
          <FavouriteIcon
            style={styles.iconLike}
            lastRoute={lastRoute}
            routeId={routeId}
            isFavorite={isFavorite}
            favoriteId={businessId}
          />
          {rate ? (
            <View style={styles.blockContentRate}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Tag rate onPress={onPressTag}>
                  <NumberFormat
                    value={rate ? rate : '0.0'}
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
                <View style={{ marginLeft: 10 }}>
                  <Text
                    caption1
                    whiteColor
                    semibold
                    style={{ marginBottom: 5 }}>
                    {rateStatus ? t(rateStatus) : ''}
                  </Text>
                  <StarRating
                    disabled={true}
                    starSize={10}
                    maxStars={5}
                    rating={rate}
                    selectedStar={(rating) => {}}
                    fullStarColor={BaseColor.yellowColor}
                  />
                </View>
              </View>
              {numReviews ? (
                <Text caption1 semibold whiteColor style={{ marginTop: 5 }}>
                  {numReviews ? `${numReviews} ${t('reviews')}` : null}
                </Text>
              ) : null}
            </View>
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 15,
            }}>
            <Text headline semibold grayColor>
              {subtitle}
            </Text>
            <Text title2 semibold style={{ marginTop: 4 }}>
              {title}
            </Text>
            {location ? (
              <View style={styles.blockLineMap}>
                <Icon
                  name="map-marker-alt"
                  color={colors.primaryLight}
                  size={12}
                />
                <Text caption1 grayColor style={{ paddingHorizontal: 4 }}>
                  {location}
                </Text>
              </View>
            ) : null}
            {phone ? (
              <View style={styles.blockLinePhone}>
                <Icon name="phone" color={colors.primaryLight} size={12} />
                <Text caption1 grayColor style={{ paddingHorizontal: 4 }}>
                  {phone}
                </Text>
              </View>
            ) : null}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  /**
   * Display place item as list
   */
  const renderList = () => {
    return (
      <View style={[styles.listContent, style]}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
          <Image source={image} style={styles.listImage} />
          <FavouriteIcon
            style={styles.iconListLike}
            lastRoute={lastRoute}
            routeId={routeId}
            isFavorite={isFavorite}
            favoriteId={businessId}
          />
          {/*<Tag status style={styles.listTagStatus}>*/}
          {/*  {t(status)}*/}
          {/*</Tag>*/}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.6}
          style={{ flex: 1 }}>
          <View style={styles.listContentRight}>
            <Text headline semibold grayColor>
              {subtitle}
            </Text>
            <Text title2 semibold numberOfLines={3} style={{ marginTop: 5 }}>
              {title}
            </Text>
            {rate ? (
              <View style={styles.lineRate}>
                <Tag onPress={onPressTag} rateSmall style={{ marginRight: 5 }}>
                  <NumberFormat
                    value={rate ? rate : '0.0'}
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
                  rating={rate}
                  selectedStar={(rating) => {}}
                  fullStarColor={BaseColor.yellowColor}
                />
              </View>
            ) : null}

            {location ? (
              <Text caption1 grayColor style={{ marginTop: 10 }}>
                {location}
              </Text>
            ) : null}
            {phone ? (
              <Text caption1 grayColor style={{ marginTop: 5 }}>
                {phone}
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  /**
   * Display place item as grid
   */
  const renderGrid = () => {
    return (
      <View style={[styles.girdContent, style]}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
          <Image source={image} style={styles.girdImage} />
          {/*<Tag status style={styles.tagGirdStatus}>*/}
          {/*  {t(status)}*/}
          {/*</Tag>*/}
          <FavouriteIcon
            style={styles.iconGirdLike}
            lastRoute={lastRoute}
            routeId={routeId}
            isFavorite={isFavorite}
            favoriteId={businessId}
          />
          {status === BusinessStatus.VERIFIED ? (
            <Tag
              status
              style={[
                styles.gridCardtagStatus,
                { backgroundColor: BaseColor.greenColor },
              ]}>
              {status}
            </Tag>
          ) : null}
        </TouchableOpacity>
        <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
          {subtitle ? (
            <Text
              footnote
              semibold
              grayColor
              numberOfLines={1}
              style={{ marginTop: 5 }}>
              {subtitle}
            </Text>
          ) : null}

          <Text subhead semibold numberOfLines={1} style={{ marginTop: 5 }}>
            {title}
          </Text>
          {rate ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <Tag onPress={onPressTag} rateSmall style={{ marginRight: 5 }}>
                <NumberFormat
                  value={rate ? rate : '0.0'}
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
                rating={rate}
                selectedStar={(rating) => {}}
                fullStarColor={BaseColor.yellowColor}
              />
            </View>
          ) : null}

          {location ? (
            <Text
              caption2
              grayColor
              style={{ marginTop: 10 }}
              numberOfLines={1}>
              {location}
            </Text>
          ) : null}
        </TouchableOpacity>
      </View>
    );
  };

  if (grid) {
    return renderGrid();
  } else if (block) {
    return renderBlock();
  } else {
    return renderList();
  }
}

PlaceItem.defaultProps = {
  style: {},
  image: Images.imagePlaceholder,
  list: true,
  block: false,
  grid: false,
  title: '',
  subtitle: '',
  location: '',
  phone: '',
  rate: undefined,
  status: '',
  rateStatus: '',
  numReviews: 0,
  isFavorite: false,
  onPress: () => {},
  onPressTag: () => {},
};
