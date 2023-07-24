import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';

import { SafeAreaView, Text, Button, Image } from '@components';
import { BaseColor, BaseStyle, useTheme } from '@config';
import * as Utils from '@utils';
import { AuthParamList } from 'navigation/models/AuthParamList';
import useAuthStore, { AuthStoreStates } from '../store/Store';

export default function WelcomeAuthScreen({
  navigation,
  route,
}: StackScreenProps<AuthParamList, 'WelcomeAuth'>) {
  const { shouldGoBack } = route?.params;
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const { colors } = useTheme();
  const { t } = useTranslation();
  const isLogin = useAuthStore((state: AuthStoreStates) => state.isLogin);

  const slideshow = [
    { key: 1, image: require('@assets/images/banners/long-view.jpg') },
    { key: 2, image: require('@assets/images/banners/danzoo-topview.jpg') },
    {
      key: 3,
      image: require('@assets/images/banners/adventure-land-night.jpg'),
    },
    { key: 4, image: require('@assets/images/banners/main-towers.jpg') },
  ];

  useEffect(() => {
    if (shouldGoBack && isLogin) {
      navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogin, shouldGoBack]);

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <ScrollView
        contentContainerStyle={styles.contain}
        scrollEnabled={scrollEnabled}
        onContentSizeChange={(contentWidth, contentHeight) =>
          setScrollEnabled(Utils.scrollEnabled(contentWidth, contentHeight))
        }>
        <View style={styles.wrapper}>
          {/* Images Swiper */}
          <Swiper
            dotStyle={{
              backgroundColor: BaseColor.dividerColor,
            }}
            activeDotColor={colors.primary}
            paginationStyle={styles.contentPage}
            removeClippedSubviews={false}>
            {slideshow.map((item) => {
              return (
                <View style={styles.slide} key={item.key}>
                  <Image source={item.image} style={styles.img} />
                  <Text body1 style={styles.textSlide}>
                    {t('pick_your_destication')}
                  </Text>
                </View>
              );
            })}
          </Swiper>
        </View>
        <View style={styles.fullWidth}>
          <Button
            full
            style={styles.marginTop}
            onPress={() => navigation.navigate('SignIn')}>
            {t('sign_in')}
          </Button>
          <View style={styles.contentActionBottom}>
            <Text style={styles.marginTop} body1 grayColor>
              OR
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text body1 primaryColor>
                {t('register')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contain: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  wrapper: {
    width: '100%',
    height: 350,
  },
  contentPage: {
    bottom: 0,
  },
  contentActionBottom: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  img: {
    width: Utils.scaleWithPixel(200),
    height: Utils.scaleWithPixel(200),
    borderRadius: Utils.scaleWithPixel(200) / 2,
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  textSlide: {
    marginTop: 30,
  },
  fullWidth: { width: '100%' },
  marginTop: {
    marginTop: 20,
  },
});
