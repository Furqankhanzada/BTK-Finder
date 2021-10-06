import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Image, Text, Icon, StarRating, Tag, FavouriteIcon } from '@components';
import { BaseColor, useTheme, Images } from '@config';
import PropTypes from 'prop-types';
import styles from './styles';
import { useTranslation } from 'react-i18next';
import {
  Placeholder,
  PlaceholderLine,
  Progressive,
  PlaceholderMedia,
} from 'rn-placeholder';
import NumberFormat from 'react-number-format';
export default function ListItem(props) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const {
    loading,
    block,
    grid,
    favorite,
    style,
    image,
    title,
    subtitle,
    address,
    rate,
    numReviews,
    phone,
    status,
    onPress,
    onPressTag,
    navigation,
    lastRoute,
    routeId,
    isFavorite,
    businessId,
  } = props;

  /**
   * Display place item as block
   */
  const renderBlock = () => {
    if (loading) {
      return (
        <Placeholder Animation={Progressive}>
          <View style={style}>
            <PlaceholderMedia style={styles.blockImage} />
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 15,
              }}>
              <PlaceholderLine style={{ width: '50%' }} />
              <PlaceholderLine style={{ width: '80%' }} />
              <View style={styles.blockLineMap}>
                <PlaceholderLine style={{ width: '25%' }} />
              </View>
              <View style={styles.blockLinePhone}>
                <PlaceholderLine style={{ width: '50%' }} />
              </View>
            </View>
          </View>
        </Placeholder>
      );
    }

    return (
      <View style={style}>
        <TouchableOpacity onPress={onPress}>
          <Image source={image} style={styles.blockImage} />
          <Tag status style={styles.tagStatus}>
            {t(status)}
          </Tag>
          {favorite ? (
            <Icon
              solid
              name="heart"
              color={BaseColor.whiteColor}
              size={18}
              style={styles.iconLike}
            />
          ) : (
            <Icon
              name="heart"
              color={BaseColor.whiteColor}
              size={18}
              style={styles.iconLike}
            />
          )}
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
                  renderText={value => (
                    <Text style={{ fontSize: 10, color: 'white' }}>
                      {value}
                    </Text>
                  )}
                />
              </Tag>
              <View style={{ marginLeft: 10 }}>
                <Text caption1 whiteColor semibold style={{ marginBottom: 5 }}>
                  {t('rate')}
                </Text>
                <StarRating
                  disabled={true}
                  starSize={10}
                  maxStars={5}
                  rating={rate}
                  selectedStar={onPressTag}
                  fullStarColor={BaseColor.yellowColor}
                />
              </View>
            </View>
            <Text caption1 semibold whiteColor style={{ marginTop: 5 }}>
              {numReviews} {t('feedback')}
            </Text>
          </View>
        </TouchableOpacity>
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 15,
          }}>
          <Text headline semibold grayColor>
            {subtitle}
          </Text>
          <Text title2 semibold style={{ marginTop: 4 }} numberOfLines={1}>
            {title}
          </Text>
          <View style={styles.blockLineMap}>
            <Icon name="map-marker-alt" color={colors.primaryLight} size={12} />
            <Text caption1 grayColor style={{ paddingHorizontal: 4 }}>
              {address}
            </Text>
          </View>
          <View style={styles.blockLinePhone}>
            <Icon name="phone" color={colors.primaryLight} size={12} />
            <Text caption1 grayColor style={{ paddingHorizontal: 4 }}>
              {phone}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  /**
   * Display place item as list
   */
  const renderList = () => {
    if (loading) {
      return (
        <Placeholder Animation={Progressive}>
          <View style={[styles.listContent, style]}>
            <PlaceholderMedia style={styles.listImage} />
            <View style={styles.listContentRight}>
              <PlaceholderLine style={{ width: '50%' }} />
              <PlaceholderLine style={{ width: '70%' }} />
              <View style={styles.lineRate}>
                <PlaceholderLine style={{ width: '50%' }} />
              </View>
              <PlaceholderLine style={{ width: '50%' }} />
            </View>
          </View>
        </Placeholder>
      );
    }

    return (
      <TouchableOpacity style={[styles.listContent, style]} onPress={onPress}>
        <Image source={image} style={styles.listImage} />
        {status ? (
          <Tag status style={styles.listTagStatus}>
            {status}
          </Tag>
        ) : null}
        <View style={[styles.listContentRight]}>
          <Text headline semibold numberOfLines={1}>
            {title}
          </Text>
          <Text footnote grayColor medium>
            {subtitle}
          </Text>
          <Text
            caption1
            grayColor
            numberOfLines={1}
            style={{ paddingRight: 20 }}>
            {address}
          </Text>
          <View style={styles.lineRate}>
            <Tag onPress={onPressTag} rateSmall style={{ marginRight: 5 }}>
              <NumberFormat
                value={rate ? rate : '0.0'}
                displayType={'text'}
                decimalScale={1}
                fixedDecimalScale={true}
                renderText={value => (
                  <Text style={{ fontSize: 10, color: 'white' }}>{value}</Text>
                )}
              />
            </Tag>
            <StarRating
              disabled={true}
              starSize={10}
              maxStars={5}
              rating={rate}
              fullStarColor={BaseColor.yellowColor}
            />
          </View>
          <FavouriteIcon
            style={styles.iconListLike}
            navigation={navigation}
            lastRoute={lastRoute}
            routeId={routeId}
            isFavorite={isFavorite}
            favoriteId={businessId}
          />
        </View>
      </TouchableOpacity>
    );
  };

  /**
   * Display place item as grid
   */
  const renderGrid = () => {
    if (loading) {
      return (
        <View style={[styles.girdContent, style]}>
          <Placeholder Animation={Progressive}>
            <View style={[styles.girdContent, style]}>
              <PlaceholderMedia style={styles.girdImage} />
              <PlaceholderLine style={{ width: '30%', marginTop: 8 }} />
              <PlaceholderLine style={{ width: '50%' }} />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 5,
                }}>
                <PlaceholderLine style={{ width: '20%' }} />
              </View>
            </View>
          </Placeholder>
        </View>
      );
    }

    return (
      <TouchableOpacity style={[styles.girdContent, style]} onPress={onPress}>
        <View>
          <Image source={image} style={styles.girdImage} />
        </View>
        <View>
          <Text headline bold style={{ marginTop: 5 }} numberOfLines={1}>
            {title}
          </Text>
          <View style={[styles.lineStatus, { marginTop: 0 }]}>
            <Text caption2 grayColor style={{ flex: 1 }} numberOfLines={1}>
              {address}
            </Text>
          </View>
          <View style={styles.lineStatus}>
            <View
              style={[
                styles.tagRate,
                { backgroundColor: colors.primaryLight },
              ]}>
              <Icon name="star" size={10} color={BaseColor.whiteColor} solid />
              <Text caption2 whiteColor semibold style={{ marginLeft: 4 }}>
                <NumberFormat
                  value={rate ? rate : '0.0'}
                  displayType={'text'}
                  decimalScale={1}
                  fixedDecimalScale={true}
                  renderText={value => (
                    <Text style={{ fontSize: 10, color: 'white' }}>
                      {value}
                    </Text>
                  )}
                />
              </Text>
            </View>
            <FavouriteIcon
              style={styles.iconGirdLike}
              navigation={navigation}
              lastRoute={lastRoute}
              routeId={routeId}
              isFavorite={isFavorite}
              favoriteId={businessId}
            />
          </View>
        </View>
      </TouchableOpacity>
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

ListItem.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  image: PropTypes.node.isRequired,
  loading: PropTypes.bool,
  block: PropTypes.bool,
  list: PropTypes.bool,
  grid: PropTypes.bool,
  favorite: PropTypes.bool,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  address: PropTypes.string,
  phone: PropTypes.string,
  rate: PropTypes.number,
  status: PropTypes.string,
  numReviews: PropTypes.number,
  onPress: PropTypes.func,
  onPressTag: PropTypes.func,
};

ListItem.defaultProps = {
  style: {},
  image: Images.imagePlaceholder,
  loading: false,
  block: false,
  list: true,
  grid: false,
  favorite: false,
  title: '',
  subtitle: '',
  address: '',
  phone: '',
  rate: 0.0,
  numReviews: 0,
  status: '',
  onPress: () => {},
  onPressTag: () => {},
};
