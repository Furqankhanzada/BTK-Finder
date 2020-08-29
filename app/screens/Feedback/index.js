import React, {useState} from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {BaseStyle, BaseColor, Images, useTheme} from '@config';
import {
  Image,
  Header,
  SafeAreaView,
  Icon,
  Text,
  StarRating,
  TextInput,
} from '@components';
import {useTranslation} from 'react-i18next';
import styles from './styles';

export default function Feedback({navigation}) {
  const {colors} = useTheme();
  const {t} = useTranslation();

  const [loading, setLoading] = useState(false);
  const [rate, setRate] = useState(4.5);
  const [title, setTitle] = useState('');
  const [review, setReview] = useState('');
  const [success, setSuccess] = useState({
    title: true,
    review: true,
  });

  /**
   * @description Called when user sumitted form
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */
  const onSubmit = () => {
    if (title == '' || review == '') {
      setSuccess({
        ...success,
        title: title != '' ? true : false,
        review: review != '' ? true : false,
      });
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(true);
        navigation.goBack();
      }, 500);
    }
  };

  const offsetKeyboard = Platform.select({
    ios: 0,
    android: 20,
  });

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{top: 'always'}}>
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
        renderRight={() => {
          if (loading) {
            return <ActivityIndicator size="small" color={colors.primary} />;
          }
          return (
            <Text headline primaryColor numberOfLines={1}>
              {t('save')}
            </Text>
          );
        }}
        onPressLeft={() => {
          navigation.goBack();
        }}
        onPressRight={() => {
          onSubmit();
        }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS == 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={offsetKeyboard}
        style={{flex: 1}}>
        <ScrollView contentContainerStyle={{alignItems: 'center', padding: 20}}>
          <Image
            source={Images.profile2}
            style={{
              width: 62,
              height: 62,
              borderRadius: 31,
            }}
          />
          <View style={{width: 160}}>
            <StarRating
              starSize={26}
              maxStars={5}
              rating={rate}
              selectedStar={rating => {
                setRate(rating);
              }}
              fullStarColor={BaseColor.yellowColor}
              containerStyle={{padding: 5}}
            />
            <Text caption1 grayColor style={{textAlign: 'center'}}>
              {t('tap_to_rate')}
            </Text>
          </View>
          <TextInput
            style={{marginTop: 10}}
            onChangeText={text => setTitle(text)}
            placeholder={t('input_title')}
            success={success.title}
            value={title}
          />
          <TextInput
            style={{marginTop: 20, height: 150}}
            onChangeText={text => setReview(text)}
            textAlignVertical="top"
            multiline={true}
            success={success.review}
            placeholder={t('input')}
            value={review}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
