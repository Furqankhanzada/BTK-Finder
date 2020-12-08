import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AuthActions } from '@actions';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView, Text, Button, Image } from '@components';
import styles from './styles';
import Swiper from 'react-native-swiper';
import { BaseColor, BaseStyle, Images, useTheme } from '@config';
import * as Utils from '@utils';
import { useTranslation } from 'react-i18next';

export default function Walkthrough(props) {
  const { navigation, lastRoute } = props;

  const [loading, setLoading] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const slideshow = [
    { key: 1, image: require('@assets/images/banners/long-view.jpg') },
    { key: 2, image: require('@assets/images/banners/danzoo-topview.jpg') },
    {
      key: 3,
      image: require('@assets/images/banners/adventure-land-night.jpg'),
    },
    { key: 4, image: require('@assets/images/banners/main-towers.jpg') },
  ];
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  /**
   * @description Simple authentication without call any APIs
   * @author Passion UI <passionui.com>
   * @date 2019-08-03
   */
  const authentication = () => {
    setLoading(true);
    dispatch(AuthActions.authentication(true, (response) => {}));
  };

  return (
    <SafeAreaView style={BaseStyle.safeAreaView} forceInset={{ top: 'always' }}>
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
            {slideshow.map((item, index) => {
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
        <View style={{ width: '100%' }}>
          <Button
            full
            style={{ marginTop: 20 }}
            loading={loading}
            onPress={() => navigation.navigate('SignIn', { lastRoute })}>
            {t('sign_in')}
          </Button>
          <View style={styles.contentActionBottom}>
            <Text style={{ marginBottom: 20 }} body1 grayColor>
              OR
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignUp', { lastRoute })}>
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
