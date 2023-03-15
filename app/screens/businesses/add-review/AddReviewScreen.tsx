import React, { useState } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';

import { BaseStyle, BaseColor, useTheme } from '@config';
import {
  Image,
  Header,
  SafeAreaView,
  Icon,
  Text,
  StarRating,
  TextInput,
  Loading,
  Button,
} from '@components';
import { useGetProfile } from '@screens/settings/profile/queries/queries';

import { ReviewStackParamList } from '../../../navigation/models/BusinessDetailBottomTabParamList';
import { AddReviewPayload, useAddReview } from '../queries/mutations';

export default function AddReviewScreen(
  props: StackScreenProps<ReviewStackParamList>,
) {
  const { navigation, route } = props;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { data: profileData } = useGetProfile();
  const stateProps = useSelector(({ businesses }: any) => businesses);
  const { createReviewLoading } = stateProps;

  const [review, setReview] = useState<AddReviewPayload>({
    rating: 4.5,
    title: '',
  });

  const { mutateAsync: mutateReview, isLoading } = useAddReview(
    route.params.businessId,
  );

  const onSubmit = async () => {
    await mutateReview(review);
    navigation.goBack();
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Loading loading={createReviewLoading} />
      <Header
        title={t('add_review')}
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
        onPressLeft={() => {
          navigation.goBack();
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Image
            source={
              profileData?.avatar
                ? { uri: profileData.avatar }
                : require('@assets/images/default-avatar.png')
            }
            style={styles.contentImage}
          />
          <View style={styles.ratingContainer}>
            <StarRating
              starSize={26}
              maxStars={5}
              rating={review?.rating}
              selectedStar={(rating) => {
                setReview({ ...review, rating });
              }}
              fullStarColor={BaseColor.yellowColor}
              containerStyle={styles.starRating}
            />
            <Text caption1 grayColor style={styles.ratingText}>
              {t('tap_to_rate')}
            </Text>
          </View>
          <TextInput
            style={styles.reviewTitle}
            onChangeText={(title) => {
              setReview({ ...review, title });
            }}
            placeholder="Title"
            value={review.title}
          />
          <TextInput
            style={styles.reviewDiscription}
            onChangeText={(description) => {
              setReview({ ...review, description });
            }}
            textAlignVertical="top"
            multiline={true}
            placeholder="Review"
            value={review.description}
          />
          <Button
            loading={isLoading}
            full
            style={styles.reviewButton}
            onPress={() => {
              onSubmit();
            }}>
            Confirm
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    padding: 20,
  },
  contentImage: {
    width: 62,
    height: 62,
    borderRadius: 31,
  },
  ratingContainer: {
    width: 160,
  },
  starRating: {
    padding: 5,
  },
  ratingText: {
    textAlign: 'center',
  },
  reviewTitle: {
    marginTop: 10,
  },
  reviewDiscription: {
    marginTop: 20,
    height: 150,
  },
  reviewButton: {
    marginTop: 20,
  },
});
