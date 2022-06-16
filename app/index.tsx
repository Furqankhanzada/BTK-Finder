import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import remoteConfig from '@react-native-firebase/remote-config';
import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import { Linking, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS, {
  PushNotification as PushNotificationIOSType,
} from '@react-native-community/push-notification-ios';

import { canOpenUrl } from '@utils';
import Navigator from './navigation';
import { store } from './store';

import useDynamicLinks from './hooks/useDynamicLinks';

export default function App() {
  const [localNotificationInfo, setLocalNotificationInfo] =
    useState<FirebaseMessagingTypes.RemoteMessage>();

  // Firebase Dynamic links handling
  useDynamicLinks();

  //IOS local notification on click functionality
  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }
    PushNotificationIOS.addEventListener(
      'localNotification',
      onRemoteNotification,
    );
  });

  // On Click Notification
  useEffect(() => {
    // Caused app to open from background state
    messaging().onNotificationOpenedApp((remoteMessage) => {
      if (remoteMessage?.data?.facebook) {
        canOpenUrl(remoteMessage?.data?.facebook, remoteMessage?.data?.link);
      } else if (remoteMessage?.data?.link) {
        Linking.openURL(remoteMessage?.data?.link);
      }
    });

    // Caused app to open from quit / closed state
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          if (remoteMessage?.data?.facebook) {
            canOpenUrl(
              remoteMessage?.data?.facebook,
              remoteMessage?.data?.link,
            );
          } else if (remoteMessage?.data?.link) {
            Linking.openURL(remoteMessage?.data?.link);
          }
        }
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
          PushNotification.localNotification({
            title: remoteMessage?.notification?.title,
            message: remoteMessage?.notification?.body!,
            bigPictureUrl: remoteMessage?.notification?.android?.imageUrl,
          });
        }
      },
    );
  });

  useEffect(() => {
    async function fetchData() {
      await remoteConfig().fetch(60 * 60);

      const fetchedRemotely = await remoteConfig().fetchAndActivate();
      if (fetchedRemotely) {
        console.log('Configs were retrieved from the backend and activated.');
      } else {
        console.log(
          'No configs were fetched from the backend, and the local configs were already activated',
        );
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    requestUserPermission();
  });

  //Android local notification on click functionality and configuration
  PushNotification.configure({
    onNotification: (notification) => {
      if (notification.userInteraction) {
        if (localNotificationInfo?.data?.facebook) {
          canOpenUrl(
            localNotificationInfo?.data?.facebook,
            localNotificationInfo?.data?.link,
          );
        } else if (localNotificationInfo?.data?.link) {
          Linking.openURL(localNotificationInfo.data.link);
        }
      }
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    requestPermissions: true,
  });

  const onRemoteNotification = (notification: PushNotificationIOSType) => {
    const isClicked = notification.getData().userInteraction === 1;
    if (isClicked) {
      if (localNotificationInfo?.data?.facebook) {
        canOpenUrl(
          localNotificationInfo?.data?.facebook,
          localNotificationInfo?.data?.link,
        );
      } else if (localNotificationInfo?.data?.link) {
        Linking.openURL(localNotificationInfo.data.link);
      }
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

  return (
    <Provider store={store}>
      <Navigator />
    </Provider>
  );
}