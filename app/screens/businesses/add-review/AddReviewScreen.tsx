import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { BaseStyle, BaseColor, useTheme } from '@config';
import { useSelector } from 'react-redux';
import { StackScreenProps } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';

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

import { ReviewStackParamList } from '../../../navigation/models/BusinessDetailBottomTabParamList';
import { AddReviewPayload, useAddReview } from '../queries/mutations';

export default function AddReviewScreen(
  props: StackScreenProps<ReviewStackParamList>,
) {
  const { navigation, route } = props;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const profileData = useSelector((state: any) => state.profile);
  const stateProps = useSelector(({ businesses }: any) => businesses);
  const { createReviewLoading } = stateProps;

  const [review, setReview] = useState<AddReviewPayload>({
    rating: 4.5,
    title: '',
  });

  const { mutateAsync: mutateReview } = useAddReview(route.params.id);

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
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ alignItems: 'center', padding: 20 }}>
          <Image
            source={
              profileData.avatar
                ? { uri: profileData.avatar }
                : require('@assets/images/default-avatar.png')
            }
            style={{
              width: 62,
              height: 62,
              borderRadius: 31,
            }}
          />
          <View style={{ width: 160 }}>
            <StarRating
              starSize={26}
              maxStars={5}
              rating={review?.rating}
              selectedStar={(rating) => {
                setReview({ ...review, rating });
              }}
              fullStarColor={BaseColor.yellowColor}
              containerStyle={{ padding: 5 }}
            />
            <Text caption1 grayColor style={{ textAlign: 'center' }}>
              {t('tap_to_rate')}
            </Text>
          </View>
          <TextInput
            style={{ marginTop: 10 }}
            onChangeText={(title) => {
              setReview({ ...review, title });
            }}
            placeholder="Title"
            value={review.title}
          />
          <TextInput
            style={{ marginTop: 20, height: 150 }}
            onChangeText={(description) => {
              setReview({ ...review, description });
            }}
            textAlignVertical="top"
            multiline={true}
            placeholder="Review"
            value={review.description}
          />
          <Button
            full
            style={{ marginTop: 20 }}
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
