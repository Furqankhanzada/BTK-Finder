import React from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ColorSchemeProvider } from 'react-native-dynamic';
import Toast from 'react-native-toast-message';

import {
  usePushNotifications,
  useDynamicLinks,
  useNativeUpdate,
  useRemoteConfig,
} from '@hooks';

import { reactQueryClient } from './services/network/client';
import Navigator from './navigation';
import { store } from './store';

export default function App() {
  // Firebase Dynamic links handling
  useDynamicLinks();
  // Firebase push notification and cloud messaging
  usePushNotifications();
  // in-app update hook
  useNativeUpdate();
  // Firebase remote config
  useRemoteConfig();

  return (
    <QueryClientProvider client={reactQueryClient}>
      <Provider store={store}>
        <ColorSchemeProvider>
          <Navigator />
          <Toast ref={(ref) => Toast.setRef(ref)} />
        </ColorSchemeProvider>
      </Provider>
    </QueryClientProvider>
  );
}
