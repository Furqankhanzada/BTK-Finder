import React from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ColorSchemeProvider } from 'react-native-dynamic';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import crashlytics from '@react-native-firebase/crashlytics';

import { reactQueryClient } from './services/network/client';
import { AlertsV2Provider } from './contexts/alerts-v2/AlertsV2Context';
import Navigator from './navigation';
import { store } from './store';
import { initMobileAds } from './hooks/useMobileAds';

// Initialize Google Mobile Ads
initMobileAds().catch((error) =>
  crashlytics().recordError(error, 'initMobileAds'),
);

export default function App() {
  return (
    <QueryClientProvider client={reactQueryClient}>
      <Provider store={store}>
        <SafeAreaProvider>
          <AlertsV2Provider>
            <ColorSchemeProvider>
              <Navigator />
              <Toast ref={(ref) => Toast.setRef(ref)} />
            </ColorSchemeProvider>
          </AlertsV2Provider>
        </SafeAreaProvider>
      </Provider>
    </QueryClientProvider>
  );
}
