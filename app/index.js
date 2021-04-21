import React, {useEffect, useState} from 'react';
import { store } from 'app/store';
import { Provider } from 'react-redux';
import remoteConfig from '@react-native-firebase/remote-config';
import messaging from '@react-native-firebase/messaging';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {Linking, Platform} from 'react-native';
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import queryString from 'query-string';
import * as NavigationService from './services/NavigationService';
import Navigator from './navigation';
console.disableYellowBox = true;

export default function App() {
  const [localNotificationInfo, setLocalNotificationInfo] = useState({});
  const navigateToBusinessDetail = (id) => {
    const interval = setInterval(() => {
      if (NavigationService.isReadyRef.current) {
        clearInterval(interval);
        NavigationService.navigate('PlaceDetail', { id });
      }
    }, 1000);
  };

    useEffect(() => {
        if (Platform.OS === 'ios') {
            PushNotificationIOS.addEventListener('notification', onRemoteNotification);
        }
    });

    const onRemoteNotification = (notification) => {
        if (Platform.OS === 'ios') {
            const isClicked = notification.getData().userInteraction === 1;

            if (isClicked) {
               console.log('User Clicked the notification')
            } else {
                console.log('User Dismissed the notification')
            }
        }
    };

  PushNotification.configure({
    onNotification: (notification) => {
      if (notification.userInteraction === false) {
        setLocalNotificationInfo(notification);
      }
      if (notification.userInteraction === true) {
        if (localNotificationInfo?.data?.link) {
          Linking.openURL(localNotificationInfo.data.link);
        }
      }
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true
    },
    requestPermissions: true
  });

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink((link) => {
      if (link && link.url) {
        const parsed = queryString.parseUrl(link.url);
        navigateToBusinessDetail(parsed.query.id);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then((link) => {
        if (link && link.url) {
          const parsed = queryString.parseUrl(link.url);
          navigateToBusinessDetail(parsed.query.id);
        }
      });
  }, []);

  // On Click Notification
  useEffect(() => {
    // Caused app to open from background state
    messaging().onNotificationOpenedApp((remoteMessage) => {
      if (remoteMessage?.data?.link) {
        Linking.openURL(remoteMessage?.data?.link);
      }
    });

    // Caused app to open from quit / closed state
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          if (remoteMessage?.data?.link) {
            Linking.openURL(remoteMessage?.data?.link);
          }
        }
      });
  }, []);

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background!', remoteMessage);
  });

  useEffect(() => {
    requestUserPermission();
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
        if (Platform.OS === 'ios') {
            PushNotificationIOS.presentLocalNotification({
                alertTitle: remoteMessage?.notification?.title,
                alertBody: remoteMessage?.notification?.body,
            })
        } else {
            PushNotification.localNotification({
                title: remoteMessage.notification.title,
                message: remoteMessage.notification.body,
                bigPictureUrl: remoteMessage.notification.android.imageUrl,
            });
        }
    });
    return unsubscribe;
  });

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      getFcmToken();
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

  return (
    <Provider store={store}>
      <Navigator />
    </Provider>
  );
}
