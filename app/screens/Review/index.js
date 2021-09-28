import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, View, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { BaseStyle, useTheme } from '@config';
import {
  Header,
  SafeAreaView,
  Icon,
  Text,
  RateDetail,
  CommentItem,
  Loading,
} from '@components';
import styles from './styles';
import { getSingleBusiness } from '../../actions/business';

export default function Review(props) {
  const { navigation, route } = props;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const stateProps = useSelector(({ businesses, profile, auth }) => {
    return {
      singleBusiness: businesses.singleBusiness,
      getSingleBusinessLoading: businesses.getSingleBusinessLoading,
      currentUserId: profile._id,
      isLogin: auth.isLogin,
    };
  });

  useEffect(() => {
    if (route?.params?.id) {
      dispatch(getSingleBusiness(route?.params?.id));
    }
  }, [route?.params?.id]);

  const dateSortedReviews = stateProps?.singleBusiness?.reviews
    ?.slice(0)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt),
        dateB = new Date(b.createdAt);
      return dateB - dateA;
    });

  const totalRating =
    stateProps?.singleBusiness?.reviewStats?.fiveStarCount +
    stateProps?.singleBusiness?.reviewStats?.fourStarCount +
    stateProps?.singleBusiness?.reviewStats?.threeStarCount +
    stateProps?.singleBusiness?.reviewStats?.twoStarCount +
    stateProps?.singleBusiness?.reviewStats?.oneStarCount;

  const fiveStarPercent =
    (stateProps?.singleBusiness?.reviewStats?.fiveStarCount * 100) /
    totalRating;
  const fourStarPercent =
    (stateProps?.singleBusiness?.reviewStats?.fourStarCount * 100) /
    totalRating;
  const threeStarPercent =
    (stateProps?.singleBusiness?.reviewStats?.threeStarCount * 100) /
    totalRating;
  const twoStarPercent =
    (stateProps?.singleBusiness?.reviewStats?.twoStarCount * 100) / totalRating;
  const oneStarPercent =
    (stateProps?.singleBusiness?.reviewStats?.oneStarCount * 100) / totalRating;

  const [refreshing] = useState(false);
  const rateDetail = {
    point: stateProps?.singleBusiness?.reviewStats?.averageRatings,
    maxPoint: 5,
    totalRating: totalRating,
    data: [
      fiveStarPercent.toString() + '%',
      fourStarPercent.toString() + '%',
      threeStarPercent.toString() + '%',
      twoStarPercent.toString() + '%',
      oneStarPercent.toString() + '%',
    ],
  };

  const navigateToWalktrhough = (lastRoute, id) => {
    navigation.navigate('Walkthrough', { lastRoute, id });
  };

  const navigateToFeedback = id => {
    navigation.navigate('Feedback', { id });
  };

  const checkReviewAlreadyAdded = () => {
    let check = false;
    if (stateProps.singleBusiness?.reviews?.length) {
      stateProps.singleBusiness.reviews.forEach(({ owner }) => {
        if (owner._id === stateProps.currentUserId) {
          check = true;
          return false;
        }
      });
    }
    return check;
  };
  const checkUserLogin = () => {
    if (stateProps.isLogin) {
      if (!checkReviewAlreadyAdded()) {
        navigateToFeedback(stateProps.singleBusiness._id);
      } else {
        Alert.alert('Review Found', 'You have already added a Review.');
      }
    } else {
      Alert.alert(
        'Login Required',
        'You must login in order to add a review.',
        [
          {
            text: 'Login',
            onPress: () => navigateToWalktrhough('Review', route?.params?.id),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ],
        { cancelable: false },
      );
    }
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <Header
        title={t('reviews')}
        renderLeft={() => {
          return (
            <Icon
              name="arrow-left"
              size={20}
              color={colors.primary}
              enableRTL={true}
            />
          );
        }}
        renderRight={() => {
          return (
            <View style={styles.addButton}>
              <Icon
                name="plus"
                size={12}
                color={colors.primary}
                enableRTL={true}
              />
              <Text
                numberOfLines={1}
                style={[styles.addButtonText, { color: colors.primary }]}>
                Add
              </Text>
            </View>
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        onPressRight={() => checkUserLogin()}
      />
      {stateProps.getSingleBusinessLoading ? (
        <Loading loading={true} />
      ) : stateProps.singleBusiness.reviews?.length ? (
        <FlatList
          contentContainerStyle={{ padding: 20 }}
          refreshControl={
            <RefreshControl
              colors={[colors.primary]}
              tintColor={colors.primary}
              refreshing={refreshing}
              onRefresh={() => {
                dispatch(getSingleBusiness(route?.params?.id));
              }}
            />
          }
          data={dateSortedReviews}
          keyExtractor={item => item.id}
          ListHeaderComponent={() => (
            <RateDetail
              point={rateDetail.point}
              maxPoint={rateDetail.maxPoint}
              totalRating={rateDetail.totalRating}
              data={rateDetail.data}
            />
          )}
          renderItem={({ item }) => (
            <CommentItem
              style={{ marginTop: 10 }}
              image={item.owner.avatar}
              name={item.owner.name}
              rate={item.rating}
              date={moment(item.createdAt).fromNow()}
              title={item.title}
              comment={item.description}
            />
          )}
        />
      ) : (
        <View style={styles.noReviewsAvailable}>
          <Text subhead>There are no Reviews in this business yet</Text>
        </View>
      )}
      {/*Users Review List */}
    </SafeAreaView>
  );
}
