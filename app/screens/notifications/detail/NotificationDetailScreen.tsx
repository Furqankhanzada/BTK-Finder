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
import Orientation from 'react-native-orientation-locker';
import VideoPlayer from 'react-native-video-controls';
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

import useAppStore from '../../../store/appStore';
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
  const { setFullScreen: setStoreFullScreen } = useAppStore();

  const [isImageLoading, setImageLoading] = useState(true);
  const [openImage, setOpenImage] = useState(false);
  const [imageHeight, setImageHeight] = useState(500);
  const [imageWidth, setImageWidth] = useState(500);
  const [fullscreen, setFullScreen] = useState<boolean>(false);

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

  const onEnterFullscreen = () => {
    setFullScreen(true);
    Orientation.lockToLandscape();
    setStoreFullScreen(true);
  };

  const onExitFullscreen = () => {
    setFullScreen(false);
    Orientation.lockToPortrait();
    setStoreFullScreen(false);
  };

  const videoPlayerView = () => {
    return (
      <VideoPlayer
        disableVolume
        disableBack
        resizeMode="contain"
        source={{
          uri: data?.video,
        }}
        onEnterFullscreen={onEnterFullscreen}
        onExitFullscreen={onExitFullscreen}
        seekColor={colors.primary}
      />
    );
  };

  useEffect(() => {
    Orientation.unlockAllOrientations();

    return () => {
      Orientation.lockToPortrait();
      setStoreFullScreen(false);
    };
  }, [setStoreFullScreen]);

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
    <View style={{ flex: 1 }}>
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
          <View
            style={[
              styles.container,
              fullscreen && styles.containerFullscreen,
            ]}>
            {data?.video ? (
              <View
                style={[
                  fullscreen
                    ? styles.videoContainerFull
                    : styles.videoContainer,
                  {
                    backgroundColor: colors.card,
                  },
                ]}>
                {videoPlayerView()}
              </View>
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
            <ScrollView
              style={[
                styles.scrollView,
                fullscreen && styles.scrollViewFullscreen,
              ]}
              showsVerticalScrollIndicator={false}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 0,
  },
  containerFullscreen: {
    padding: 0,
  },
  scrollView: {
    flex: 1,
    marginBottom: 20,
  },
  scrollViewFullscreen: {
    marginBottom: 0,
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
  videoContainer: {
    width: '100%',
    height: 200,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  videoContainerFull: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    flex: 1,
    zIndex: 99,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
