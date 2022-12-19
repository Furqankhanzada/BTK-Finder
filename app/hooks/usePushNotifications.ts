import { useEffect, useState } from 'react'; 
import { Linking, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS, {
  PushNotification as PushNotificationIOSType,
} from '@react-native-community/push-notification-ios';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

import { canOpenUrl } from '@utils';

export default function usePushNotifications() {
  const [localNotificationInfo, setLocalNotificationInfo] =
    useState<FirebaseMessagingTypes.RemoteMessage | null>(null);

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

    // When a notification from FCM has triggered the application to open from a quit state,
    // this method will return a RemoteMessage containing the notification data, or null if the app was opened via another method.
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
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

  const navigateToLink = (
    notification: FirebaseMessagingTypes.RemoteMessage | null,
  ) => {
    if (notification && notification.data) {
      const { facebook, link } = notification.data;
      if (facebook) {
        canOpenUrl(facebook, link);
      } else if (link) {
        Linking.openURL(link);
      }
    }
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
