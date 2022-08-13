import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import remoteConfig from '@react-native-firebase/remote-config';
import { QueryClientProvider } from '@tanstack/react-query';

import { usePushNotifications, useDynamicLinks, useNativeUpdate } from '@hooks';

import { apolloClient, reactQueryClient } from './services/network/client';
import Navigator from './navigation';
import { store } from './store';

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
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={reactQueryClient}>
        <Provider store={store}>
          <Navigator />
        </Provider>
      </QueryClientProvider>
    </ApolloProvider>
  );
}
