import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { FavouriteIcon, StarRating, Tag, Text } from '@components';
import { BaseColor, useTheme } from '@config';
import NumberFormat from 'react-number-format';
import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';

import {
  BusinessPresentable,
  BusinessStatus,
} from '@screens/businesses/models/BusinessPresentable';

interface Props {
  onNavigate: (route: string) => void;
  business: BusinessPresentable;
  isPreview: boolean;
}

export default function OverviewCard({
  business,
  isPreview,
  onNavigate,
}: Props) {
  const user = useSelector((state: any) => state.profile);
  const { colors } = useTheme();
  const { t } = useTranslation();

  const isBusinessOpened = () => {
    //Week Days
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    //Current Date that gives us current Time also
    let dt = new Date();

    //Current Day
    let getCurrentDay = days[dt.getDay()];

    //Return Open if current day is available in open hours days
    if (business?.openHours?.find((item: any) => item.day === getCurrentDay)) {
      //12 hours to 24 hours converting function
      const convertTime12to24 = (time12h: any) => {
        const [time, modifier] = time12h.split(' ');

        let [hours, minutes] = time.split(':');

        if (hours === '12') {
          hours = '00';
        }

        if (modifier === 'pm') {
          hours = parseInt(hours, 10) + 12;
        }
        if (modifier === 'PM') {
          hours = parseInt(hours, 10) + 12;
        }

        return `${hours}:${minutes}:00`;
      };

      //Get Data of current day from Open hours
      let currentDayObject = business?.openHours.filter(
        (obj: any) => obj.day === getCurrentDay,
      );

      let startTime = convertTime12to24(currentDayObject[0].from);
      let endTime = convertTime12to24(currentDayObject[0].to);

      let s = startTime.split(':');
      let dt1 = new Date(
        dt.getFullYear(),
        dt.getMonth(),
        dt.getDate(),
        parseInt(s[0], 10),
        parseInt(s[1], 10),
        parseInt(s[2], 10),
      );

      let e = endTime.split(':');
      let dt2 = new Date(
        dt.getFullYear(),
        dt.getMonth(),
        dt.getDate(),
        parseInt(e[0], 10),
        parseInt(e[1], 10),
        parseInt(e[2], 10),
      );

      if (dt >= dt1 && dt <= dt2) {
        return 'Opened';
      }
    }

    return 'Closed';
  };

  const ratingStatus = (rating: number) => {
    if (rating <= 0) {
      return 'No Ratings';
    }
    if (rating <= 1.9) {
      return 'Poor';
    }
    if (rating <= 2.9) {
      return 'Fair';
    }
    if (rating <= 3.9) {
      return 'Average';
    }
    if (rating <= 4.9) {
      return 'Good';
    }
    if (rating <= 5) {
      return 'Excellent';
    }
  };

  const businessStatus = () => {
    const isVerified = (status: string) => {
      if (status === 'VERIFIED') {
        return 'VERIFIED';
      }
      return 'UNVERIFIED';
    };

    return (
      <View
        style={[
          styles.promotionTag,
          {
            backgroundColor:
              business.status === BusinessStatus.VERIFIED
                ? '#198201'
                : colors.border,
          },
        ]}>
        <FontAwesomeIcons
          style={styles.verifyIcon}
          name={
            business.status === BusinessStatus.VERIFIED ? 'check-circle' : ''
          }
          size={12}
        />
        <Text
          overline
          medium
          style={{
            color:
              business?.status === BusinessStatus.VERIFIED
                ? '#fff'
                : colors.text,
          }}>
          {isVerified(business?.status)}
        </Text>
      </View>
    );
  };

  const isFavorite = !!business.favorites?.find((favorite: any) => {
    console.log('inside Favorite', favorite.ownerId);
    return favorite.ownerId === user._id;
  });
  console.log('is Favorite  ?', isFavorite);

  return (
    <View
      style={[
        styles.boxInfo,
        {
          backgroundColor: colors.card,
          shadowColor: colors.border,
          borderColor: colors.border,
        },
      ]}>
      <View style={{ flex: 1 }}>
        <Text title3 semibold>
          {business.name}
        </Text>
        <View>
          <View style={styles.contentStatus}>
            <Text caption2 accentColor medium>
              {business?.openHours && isBusinessOpened()}
            </Text>
            <View style={styles.dot} />
            <Text caption2 grayColor style={styles.catagory} numberOfLines={1}>
              {business.category}
            </Text>
          </View>
        </View>
        <View style={styles.contentStatus}>
          {isPreview ? (
            <TouchableOpacity
              style={styles.contentRate}
              onPress={() =>
                /* navigateToReview() */ console.log('navigateToReview')
              }>
              <View style={styles.rateContainer}>
                <Tag rate>
                  <Text caption2 whiteColor semibold style={styles.ratingText}>
                    0.0
                  </Text>
                </Tag>
                <View style={styles.ratingContainer}>
                  <StarRating
                    disabled={true}
                    starSize={10}
                    maxStars={5}
                    rating={business.reviewStats?.averageRatings}
                    fullStarColor={BaseColor.yellowColor}
                    containerStyle={styles.containerStyle}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.contentRate}
              onPress={() => onNavigate('Reviews')}>
              <View style={styles.rateContainer}>
                <Tag rate>
                  <Text caption2 whiteColor semibold style={styles.rateText}>
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
                        <Text style={styles.value}>{value}</Text>
                      )}
                    />
                  </Text>
                </Tag>
                <View style={styles.rateTitle}>
                  <View style={styles.rateSubTitle}>
                    <Text
                      caption2
                      whiteColor
                      semibold
                      style={{ color: colors.text }}>
                      {ratingStatus(business.reviewStats?.averageRatings)}
                    </Text>
                    <View style={styles.dot} />
                    <Text
                      caption2
                      whiteColor
                      semibold
                      style={{ color: colors.text }}>
                      ({business?.reviews?.length}) {t('reviews')}
                    </Text>
                  </View>
                  <StarRating
                    disabled={true}
                    starSize={10}
                    maxStars={5}
                    rating={business?.reviewStats?.averageRatings}
                    fullStarColor={BaseColor.yellowColor}
                    containerStyle={styles.containerDiv}
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.boxContentRight}>
        {businessStatus()}
        {isPreview ? null : (
          <View style={styles.iconLike}>
            <FavouriteIcon
              name={business.name}
              style={styles.iconGirdLike}
              // navigation={navigation}
              lastRoute="BusinessDetailTabNavigator"
              routeId={business?._id}
              isFavorite={
                !!business.favorites?.find(
                  (favorite: any) => favorite.ownerId === user._id,
                )
              }
              favoriteId={business?._id}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boxInfo: {
    padding: 10,
    minHeight: 120,
    marginBottom: 20,
    width: '100%',
    borderRadius: 8,
    borderWidth: 0.5,
    shadowOffset: { width: 1.5, height: 1.5 },
    shadowOpacity: 1.0,
    elevation: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: BaseColor.grayColor,
    marginHorizontal: 10,
  },
  boxContentRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  iconLike: {
    position: 'absolute',
    bottom: 0,
    right: 3,
  },
  promotionTag: {
    borderRadius: 7,
    height: 16,
    paddingHorizontal: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconGirdLike: {
    position: 'absolute',
    bottom: 5,
    right: 5,
  },
  contentRate: {},
  ratingContainer: {
    marginLeft: 10,
  },
  value: {
    fontSize: 10,
    color: 'white',
  },
  rateSubTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
  },
  containerStyle: {
    marginRight: 5,
  },
  rateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rateText: {
    marginLeft: 4,
  },
  rateTitle: {
    marginLeft: 10,
  },
  catagory: {
    flex: 1,
  },
  containerDiv: {
    width: 50,
  },
  verifyIcon: {
    color: '#fff',
    paddingRight: 2,
  },
});
