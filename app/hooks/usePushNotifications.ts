import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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

import { handleError, navigateToLink, socket } from '@utils';

import axiosApiInstance from '../interceptor/axios-interceptor';
import { DEVICES_API } from '../constants';

type Device = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  deviceUniqueId: string;
  fcmToken: string;
  os: string;
  osVersion: string;
};

type DevicePayload = Pick<
  Device,
  'deviceUniqueId' | 'fcmToken' | 'os' | 'osVersion' | 'userId'
>;

export const useDeviceRegistration = () => {
  return useMutation<Device, Error, DevicePayload>((payload) => {
    return axiosApiInstance({
      method: 'POST',
      url: DEVICES_API,
      data: payload,
    })
      .then((response) => response.data)
      .catch(({ response }) => {
        handleError(response.data);
      });
  });
};

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
    messaging()
      .hasPermission()
      .then((status) => {
        if (status === messaging.AuthorizationStatus.NOT_DETERMINED) {
          messaging().requestPermission();
        }
      });
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
