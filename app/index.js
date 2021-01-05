import React, { useEffect } from 'react';
import { store } from 'app/store';
import { Provider } from 'react-redux';
import Navigator from './navigation';
import remoteConfig from '@react-native-firebase/remote-config';

console.disableYellowBox = true;

export default function App() {
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
