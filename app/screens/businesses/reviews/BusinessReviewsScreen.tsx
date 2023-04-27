import React, { useState } from 'react';
import {
  FlatList,
  RefreshControl,
  View,
  Alert,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { StackScreenProps } from '@react-navigation/stack';

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
import { useBusiness } from '@screens/businesses/queries/queries';
import { useGetProfile } from '@screens/settings/profile/queries/queries';
import useAuthStore, { AuthStoreStates } from '@screens/auth/store/Store';
import { GlobalParamList } from '../../../navigation/models/GlobalParamList';

export default function Review(
  props: StackScreenProps<GlobalParamList, 'Reviews'>,
) {
  const { navigation, route } = props;
  const { colors } = useTheme();
  const { t } = useTranslation();

  const isLogin = useAuthStore((state: AuthStoreStates) => state.isLogin);
  const { data: profileData } = useGetProfile();
  const {
    isLoading,
    data: business,
    refetch,
  } = useBusiness(route.params.businessId);

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const dateSortedReviews = business?.reviews
    ?.slice(0)
    .sort((a: any, b: any) => {
      const dateA: any = new Date(a.createdAt),
        dateB: any = new Date(b.createdAt);
      return dateB - dateA;
    });

  const totalRating =
    business?.reviewStats?.fiveStarCount! +
    business?.reviewStats?.fourStarCount! +
    business?.reviewStats?.threeStarCount! +
    business?.reviewStats?.twoStarCount! +
    business?.reviewStats?.oneStarCount!;

  const fiveStarPercent =
    (business?.reviewStats?.fiveStarCount! * 100) / totalRating;
  const fourStarPercent =
    (business?.reviewStats?.fourStarCount! * 100) / totalRating;
  const threeStarPercent =
    (business?.reviewStats?.threeStarCount! * 100) / totalRating;
  const twoStarPercent =
    (business?.reviewStats?.twoStarCount! * 100) / totalRating;
  const oneStarPercent =
    (business?.reviewStats?.oneStarCount! * 100) / totalRating;

  const rateDetail = {
    point: business?.reviewStats?.averageRatings,
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

  const navigateToWelcomeAuth = () => {
    navigation.navigate('AuthStackNavigator', {
      screen: 'WelcomeAuth',
    });
  };

  const navigateToFeedback = (id: any) => {
    navigation.navigate('AddReview', { businessId: id });
  };

  const checkReviewAlreadyAdded = () => {
    let check = false;
    if (business?.reviews?.length) {
      business?.reviews.forEach(({ owner }: any) => {
        if (owner._id === profileData?._id) {
          check = true;
          return false;
        }
      });
    }
    return check;
  };
  const checkUserLogin = () => {
    if (isLogin) {
      if (!checkReviewAlreadyAdded()) {
        navigateToFeedback(business?._id);
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
            onPress: () => navigateToWelcomeAuth(),
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

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
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
      ) : business?.reviews?.length ? (
        <FlatList
          contentContainerStyle={styles.flatListStyle}
          refreshControl={
            <RefreshControl
              title="Pull to refresh"
              colors={[colors.primary]}
              tintColor={colors.primary}
              titleColor={colors.text}
              refreshing={isRefreshing}
              onRefresh={onRefresh}
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
              style={styles.commentItemStyle}
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
          <Text subhead>No reviews found</Text>
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
  flatListStyle: {
    padding: 20,
  },
  commentItemStyle: {
    marginTop: 10,
  },
});
