import React from 'react';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ColorSchemeProvider } from 'react-native-dynamic';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';

import {
  usePushNotifications,
  useDynamicLinks,
  useNativeUpdate,
  useRemoteConfig,
} from '@hooks';

import { reactQueryClient } from './services/network/client';
import { AlertsV2Provider } from './contexts/alerts-v2/AlertsV2Context';
import Navigator from './navigation';
import { store } from './store';

mobileAds()
  .setRequestConfiguration({
    // Update all future requests suitable for parental guidance
    maxAdContentRating: MaxAdContentRating.PG,

    // Indicates that you want your content treated as child-directed for purposes of COPPA.
    tagForChildDirectedTreatment: true,

    // Indicates that you want the ad request to be handled in a
    // manner suitable for users under the age of consent.
    tagForUnderAgeOfConsent: true,

    // An array of test device IDs to allow.
    testDeviceIdentifiers: ['EMULATOR'],
  })
  .then(() => {
    // Request config successfully set!
    // console.log('@Request config successfully set!');
    mobileAds()
      .initialize()
      .then((adapterStatuses) => {
        // Initialization complete!
        // console.log('@Initialization complete!', adapterStatuses);
      });
  });

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
