import React, { useState } from 'react';
import {
  FlatList,
  RefreshControl,
  View,
  Alert,
  StyleSheet,
} from 'react-native';
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
import { getSingleBusiness } from '../../../actions/business';
import { useBusiness } from '@screens/businesses/apis/queries';

export default function Review(props: any) {
  const { navigation, route } = props;
  const {
    isLoading,
    data: { _id: businessId, reviews, reviewStats },
  } = useBusiness(route?.params?.id);

  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const stateProps = useSelector(({ profile, auth }: any) => {
    return {
      currentUserId: profile._id,
      isLogin: auth.isLogin,
    };
  });

  const dateSortedReviews = reviews?.slice(0).sort((a: any, b: any) => {
    const dateA: any = new Date(a.createdAt),
      dateB: any = new Date(b.createdAt);
    return dateB - dateA;
  });

  const totalRating =
    reviewStats?.fiveStarCount +
    reviewStats?.fourStarCount +
    reviewStats?.threeStarCount +
    reviewStats?.twoStarCount +
    reviewStats?.oneStarCount;

  const fiveStarPercent = (reviewStats?.fiveStarCount * 100) / totalRating;
  const fourStarPercent = (reviewStats?.fourStarCount * 100) / totalRating;
  const threeStarPercent = (reviewStats?.threeStarCount * 100) / totalRating;
  const twoStarPercent = (reviewStats?.twoStarCount * 100) / totalRating;
  const oneStarPercent = (reviewStats?.oneStarCount * 100) / totalRating;

  const [refreshing] = useState(false);
  const rateDetail = {
    point: reviewStats?.averageRatings,
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

  const navigateToWalktrhough = (lastRoute: any, id: any) => {
    navigation.navigate('Walkthrough', { lastRoute, id });
  };

  const navigateToFeedback = (id: any) => {
    navigation.navigate('Feedback', { id });
  };

  const checkReviewAlreadyAdded = () => {
    let check = false;
    if (reviews?.length) {
      reviews.forEach(({ owner }: any) => {
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
        navigateToFeedback(businessId);
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
    <SafeAreaView style={BaseStyle.safeAreaView}>
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
      {isLoading ? (
        <Loading loading={true} />
      ) : reviews?.length ? (
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
          keyExtractor={(item) => item._id}
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

const styles = StyleSheet.create({
  noReviewsAvailable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    padding: 5,
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 15,
    marginLeft: 5,
  },
});
