import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import remoteConfig from '@react-native-firebase/remote-config';

import { usePushNotifications, useDynamicLinks, useNativeUpdate } from '@hooks';

import Navigator from './navigation';
import { store } from './store';
import { client } from './services/network/client';

export default function App() {
  // Firebase Dynamic links handling
  useDynamicLinks();
  // Firebase push notification and cloud messaging
  usePushNotifications();
  // in-app update hook
  useNativeUpdate();

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
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Navigator />
      </Provider>
    </ApolloProvider>
  );
}
