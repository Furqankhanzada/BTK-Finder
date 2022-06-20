import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import remoteConfig from '@react-native-firebase/remote-config';
import Navigator from './navigation';
import { store } from './store';

import usePushNotifications from './hooks/usePushNotifications';
import useDynamicLinks from './hooks/useDynamicLinks';

export default function App() {
  // Firebase Dynamic links handling
  useDynamicLinks();
  // Firebase Dynamic push notification and cloud messaging
  usePushNotifications();

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
