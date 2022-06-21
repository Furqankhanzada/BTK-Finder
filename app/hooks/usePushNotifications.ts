import { useEffect, useState } from 'react';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { Linking, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS, {
  PushNotification as PushNotificationIOSType,
} from '@react-native-community/push-notification-ios';
import Config from 'react-native-config';

import { canOpenUrl } from '@utils';

export default function usePushNotifications() {
  const [localNotificationInfo, setLocalNotificationInfo] =
    useState<FirebaseMessagingTypes.RemoteMessage>();

  const createChannel = () => {
    PushNotification.createChannel(
      {
        channelId: Config.ANDROID_CHANNEL_ID, // (required)
        channelName: 'Special message', // (required)
        channelDescription: 'Notification for special message', // (optional) default: undefined.
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
  };

  interface NotificationType {
    data: {
      facebook: string;
      link: string;
    };
  }

  const navigateToLink = (notification: any) => {
    if (notification?.data?.facebook) {
      canOpenUrl(notification?.data?.facebook, notification?.data?.link);
    } else if (notification?.data?.link) {
      Linking.openURL(notification.data.link);
    }
  };

  //IOS local notification on click functionality
  useEffect(() => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.addEventListener(
        'notification',
        onRemoteNotificationIOS,
      );
    } else {
      handleAndroidPushNotification();
    }
  });

  // On Click Notification
  useEffect(() => {
    // Caused app to open from background state
    messaging().onNotificationOpenedApp((remoteMessage) => {
      navigateToLink(remoteMessage);
    });

    // Caused app to open from quit / closed state
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        navigateToLink(remoteMessage);
      });
  }, []);

  useEffect(() => {
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
          createChannel();
          PushNotification.localNotification({
            channelId: Config.ANDROID_CHANNEL_ID,
            title: remoteMessage?.notification?.title,
            message: remoteMessage?.notification?.body!,
            bigPictureUrl: remoteMessage?.notification?.android?.imageUrl,
          });
        }
      },
    );
  });

  useEffect(() => {
    requestUserPermission();
  });
  [];

  //Android local notification on click functionality and configuration
  const handleAndroidPushNotification = () =>
    PushNotification.configure({
      onNotification: (notification) => {
        if (notification.userInteraction) {
          navigateToLink(localNotificationInfo);
        }
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      requestPermissions: true,
    });

  const onRemoteNotificationIOS = (notification: PushNotificationIOSType) => {
    const isClicked = notification.getData().userInteraction === 1;
    if (isClicked) {
      navigateToLink(localNotificationInfo);
    }
  };

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background!', remoteMessage);
  });

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      await getFcmToken();
      console.log('Authorization status:', authStatus);
    }
  };

  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('Your Firebase Token is:', fcmToken);
    } else {
      console.log('Failed', 'No token received');
    }
  };
}
