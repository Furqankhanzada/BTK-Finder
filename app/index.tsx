import React from 'react';
import { Provider } from 'react-redux';
import Navigator from './navigation';
import { store } from './store';

import usePushNotifications from './hooks/usePushNotifications';
import useDynamicLinks from './hooks/useDynamicLinks';

export default function App() {
  // Firebase Dynamic links handling
  useDynamicLinks();
  // Firebase Dynamic push notification and cloud messaging
  usePushNotifications();

  return (
    <Provider store={store}>
      <Navigator />
    </Provider>
  );
}
