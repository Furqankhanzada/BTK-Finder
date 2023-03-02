import { useEffect, useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import {
  getSystemName,
  getSystemVersion,
  getUniqueId,
} from 'react-native-device-info';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS, {
  PushNotification as PushNotificationIOSType,
} from '@react-native-community/push-notification-ios';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import {
  checkNotifications,
  NotificationsResponse,
  requestNotifications,
  RESULTS,
} from 'react-native-permissions';

import { navigateToLink, socket } from '@utils';
import { useDeviceRegistration } from '../apis/mutations';

export default function usePushNotifications() {
  const [localNotificationInfo, setLocalNotificationInfo] =
    useState<FirebaseMessagingTypes.RemoteMessage | null>(null);

  const { mutate: registerDevice } = useDeviceRegistration();
  const queryClient = useQueryClient();

  useEffect(() => {
    const getFcmToken = async () => {
      const fcmToken = await messaging().getToken();
      registerDevice({
        deviceUniqueId: getUniqueId(),
        fcmToken,
        os: getSystemName(),
        osVersion: getSystemVersion(),
      });
    };
    getFcmToken();
  }, [registerDevice]);

  useEffect(() => {
    socket.on('notification', () => {
      queryClient.invalidateQueries(['notifications']);
      queryClient.invalidateQueries(['notifications-count']);
    });
    return () => {
      socket.removeListener('notification');
    };
  }, [queryClient]);

  // request user permission
  useEffect(() => {
    if (Platform.OS === 'android') {
      requestNotifications(['alert']).then(() => {
        checkNotifications().then(({ status }: NotificationsResponse) => {
          if (status === RESULTS.DENIED || RESULTS.BLOCKED) {
            Alert.alert(
              'Allow Notifications',
              'Open Settings > Manage Notifications > Allow notifications from Explore BTK',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Open Settings',
                  onPress: () => Linking.openSettings(),
                },
              ],
              {
                cancelable: false,
              },
            );
          }
        });
      });
    } else {
      messaging()
        .hasPermission()
        .then((status) => {
          if (
            status === messaging.AuthorizationStatus.NOT_DETERMINED ||
            status === messaging.AuthorizationStatus.DENIED
          ) {
            messaging().requestPermission();
          }
        });
    }
  });

  useEffect(() => {
    if (Platform.OS === 'ios') {
      const type = 'notification';
      PushNotificationIOS.addEventListener(type, onRemoteNotificationIOS);
      return () => {
        PushNotificationIOS.removeEventListener(type);
      };
    } else {
      handleAndroidPushNotification();
    }
  });

  useEffect(() => {
    // When the user presses a notification displayed via FCM,
    // this listener will be called if the app has opened from a background state.
    messaging().onNotificationOpenedApp((remoteMessage) => {
      navigateToLink(remoteMessage);
    });
  }, []);

  useEffect(() => {
    // When any FCM payload is received, the listener callback is called with a `RemoteMessage`.
    return messaging().onMessage(
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        setLocalNotificationInfo(remoteMessage);
        if (Platform.OS === 'ios') {
          PushNotificationIOS.addNotificationRequest({
            id: remoteMessage.messageId!,
            title: remoteMessage?.notification?.title,
            body: remoteMessage?.notification?.body,
          });
        } else {
          // In the future we can create multiple channels here like Promotional, Informational, Events, etc ...
          createChannel(remoteMessage?.notification?.android?.channelId);
          PushNotification.localNotification({
            channelId: remoteMessage?.notification?.android?.channelId,
            title: remoteMessage?.notification?.title,
            message: remoteMessage?.notification?.body!,
            bigPictureUrl: remoteMessage?.notification?.android?.imageUrl,
          });
        }
      },
    );
  });

  const createChannel = (channelId: any) => {
    PushNotification.createChannel(
      {
        channelId,
        channelName: 'Announcements',
        channelDescription: 'Announcements related to BTK official and events.', // (optional) default: undefined.
      },
      // typescript required callback
      () => {},
    );
  };

  // Android local notification on click functionality and configuration
  const handleAndroidPushNotification = () => {
    PushNotification.configure({
      onNotification: (notification) => {
        if (notification.userInteraction) {
          navigateToLink(localNotificationInfo);
        }
      },
    });
  };

  const onRemoteNotificationIOS = (notification: PushNotificationIOSType) => {
    const isClicked = notification.getData().userInteraction === 1;
    if (isClicked) {
      navigateToLink(localNotificationInfo);
    }
  };
}
