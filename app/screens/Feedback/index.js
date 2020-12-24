import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { BaseStyle, BaseColor, Images, useTheme } from '@config';
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
import { useTranslation } from 'react-i18next';
// import styles from './styles';
import { addReview } from '../../actions/business';
import { useDispatch, useSelector } from 'react-redux';

export default function Feedback(props) {
  const { navigation, route } = props;
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const stateProps = useSelector(({ businesses }) => businesses);
  const { createReviewLoading } = stateProps;

  const [rate, setRate] = useState(4.5);
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');

  let payload = {
    title: title,
    description: review,
    rating: rate,
  };

  const addCallback = () => {
    navigation.goBack();
  };

  const onSubmit = () => {
    dispatch(addReview(payload, addCallback, route?.params?.id));
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
      <Loading loading={createReviewLoading} />
      <Header
        title={t('feedback')}
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
        behavior={Platform.OS == 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ alignItems: 'center', padding: 20 }}>
          <Image
            source={Images.defaultAvatar}
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
              rating={rate}
              selectedStar={(rating) => {
                setRate(rating);
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
            onChangeText={(text) => setTitle(text)}
            placeholder="Title"
            value={title}
          />
          <TextInput
            style={{ marginTop: 20, height: 150 }}
            onChangeText={(text) => setReview(text)}
            textAlignVertical="top"
            multiline={true}
            placeholder="Review"
            value={review}
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
