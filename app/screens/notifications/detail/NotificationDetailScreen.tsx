import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Linking,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { getUniqueId } from 'react-native-device-info';
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

import { VideoModel } from './components/VideoModal';

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

  const [showModal, setShowModal] = useState<any>({
    isVisible: false,
    video: null,
  });

  const toggleModal = (state: any) => {
    setShowModal({
      isVisible: state.isVisible,
      video: state.video,
    });
  };

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
      {showModal.isVisible ? (
        <VideoModel
          isVisible={showModal.isVisible}
          toggleModal={toggleModal}
          video={showModal.video}
          {...props}
        />
      ) : null}

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
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}>
            {data?.video ? (
              <TouchableOpacity
                onPress={() => {
                  setShowModal({
                    isVisible: true,
                    video: data.video,
                  });
                }}>
                <View
                  style={[
                    styles.playVideo,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}>
                  <Image source={data?.image} style={styles.videoThumbnail} />
                  <Icon
                    name="play"
                    size={35}
                    color={colors.primary}
                    enableRTL={true}
                    style={styles.playIcon}
                  />
                </View>
              </TouchableOpacity>
            ) : data?.image ? (
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
            <Text body1 numberOfLines={1000} style={styles.content}>
              {data?.description}
            </Text>
          </ScrollView>
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
  scrollView: {
    flex: 1,
    marginBottom: 20,
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
    marginVertical: 10,
  },
  button: {
    marginTop: 'auto',
  },
  icon: {
    marginRight: 10,
  },
  playVideo: {
    width: '100%',
    height: 200,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  playIcon: {
    position: 'absolute',
  },
});
