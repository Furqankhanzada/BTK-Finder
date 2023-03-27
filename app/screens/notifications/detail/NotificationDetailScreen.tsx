import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getUniqueId } from 'react-native-device-info';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImageView from 'react-native-image-viewing';
import { StackScreenProps } from '@react-navigation/stack';

import {
  Header,
  SafeAreaView,
  Icon,
  Image,
  Text,
  Button,
  Loading,
} from '@components';
import { BaseStyle, useTheme } from '@config';
import { NotificationParamList } from 'navigation/models/NotificationParamList';
import { NotificationDetailPlaceholder } from './components/NotificationDetailPlaceholder';
import { useNotification } from '../queries/queries';
import { useReadNotification } from '../queries/mutations';
import { NotificationType } from '../models/NotificationPresentable';

export default function NotificationDetailScreen(
  props: StackScreenProps<NotificationParamList, 'NotificationDetail'>,
) {
  const { t } = useTranslation();
  const { navigation, route } = props;
  const { colors } = useTheme();

  const { data, isLoading } = useNotification(route?.params?.id);
  const { mutate } = useReadNotification();

  const [isImageLoading, setImageLoading] = useState(true);
  const [openImage, setOpenImage] = useState(false);
  const [imageHeight, setImageHeight] = useState(500);
  const [imageWidth, setImageWidth] = useState(500);

  const getTitle = (type?: NotificationType) => {
    switch (type) {
      case NotificationType.ANNOUNCEMENT:
        return t('notification.detail.announcement');
      case NotificationType.BUSINESS:
        return t('notification.detail.business');
      case NotificationType.USER:
        return t('notification.detail.notification');
      case NotificationType.REVIEW:
        return t('notification.detail.review_added');
      default:
        return null;
    }
  };

  useEffect(() => {
    if (!route?.params?.read) {
      mutate({
        read: true,
        notificationId: route?.params?.id,
        deviceUniqueId: getUniqueId().toString(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutate]);

  return (
    <SafeAreaView style={BaseStyle.safeAreaView}>
      <Header
        title={getTitle(data?.type)}
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

      <ImageView
        backgroundColor={colors.background}
        images={[{ uri: data?.image }]}
        imageIndex={0}
        visible={openImage}
        onRequestClose={() => setOpenImage(false)}
      />

      {isLoading ? (
        <NotificationDetailPlaceholder />
      ) : (
        <View style={styles.container}>
          {data?.image ? (
            <TouchableOpacity
              onPress={() => setOpenImage(true)}
              style={styles.imageContainer}>
              <Image
                source={data?.image}
                style={[
                  styles.image,
                  { aspectRatio: imageWidth / imageHeight },
                ]}
                onLoadEnd={() => setImageLoading(false)}
                onLoad={(evt: any) => {
                  setImageHeight(evt.nativeEvent.height);
                  setImageWidth(evt.nativeEvent.width);
                }}
              />
              <Loading loading={isImageLoading} />
            </TouchableOpacity>
          ) : null}
          <Text title2 bold style={styles.title}>
            {data?.title}
          </Text>
          <Text body1 style={styles.content}>
            {data?.description}
          </Text>
          {data?.link ? (
            <Button
              full
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={() => Linking.openURL(data.link ?? '')}>
              {t('notification.detail.view_details')}
            </Button>
          ) : null}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  imageContainer: {
    borderRadius: 10,
  },
  image: {
    borderRadius: 10,
  },
  title: {
    marginTop: 15,
  },
  content: {
    marginTop: 10,
  },
  button: {
    marginTop: 'auto',
  },
  icon: {
    marginRight: 10,
  },
});
