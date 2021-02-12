import React, { useEffect } from 'react';
import { store } from 'app/store';
import { Provider } from 'react-redux';
import remoteConfig from '@react-native-firebase/remote-config';
import messaging from '@react-native-firebase/messaging';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { Linking } from 'react-native';
import queryString from 'query-string';
import * as NavigationService from './services/NavigationService';
import Navigator from './navigation';
console.disableYellowBox = true;

export default function App() {
  const navigateToBusinessDetail = (id) => {
    const interval = setInterval(() => {
      if (NavigationService.isReadyRef.current) {
        clearInterval(interval);
        NavigationService.navigate('PlaceDetail', { id });
      }
    }, 1000);
  };

  const handleDynamicLink = (link) => {
    const parsed = queryString.parseUrl(link.url);
    navigateToBusinessDetail(parsed.query.id);
  };

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then((link) => {
        const parsed = queryString.parseUrl(link.url);
        navigateToBusinessDetail(parsed.query.id);
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
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
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
