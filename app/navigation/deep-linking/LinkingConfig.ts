import { LinkingOptions } from '@react-navigation/native';
import { Linking } from 'react-native';
import messaging from '@react-native-firebase/messaging';

import { RootStackParamList } from '../models/RootStackParamList';
import { canOpenUrl } from '@utils';

export const linkingConfig: LinkingOptions<RootStackParamList> = {
  prefixes: ['explorebtk://', 'https://explorebtk.com'],
  config: {
    screens: {
      Main: {
        path: 'app',
        initialRouteName: 'MainBottomTabNavigator',
        screens: {
          Businesses: {
            path: 'businesses',
            exact: true,
          },
          BusinessDetailTabNavigator: {
            path: 'businesses/:businessId',
            exact: true,
            // @ts-expect-error because we did heck
            screens: {
              DetailStack: {
                path: 'overview',
                exact: true,
                screens: {
                  Product: {
                    path: 'businesses/:businessId/products/:productSlug',
                    exact: true,
                  },
                },
              },
              ReviewStack: 'reviews',
              Products: 'products',
            },
          },
          ContactUs: {
            path: 'contact-us',
            exact: true,
          },
          AboutUs: {
            path: 'about-us',
            exact: true,
          },
          MyBusinesses: {
            path: 'my-businesses',
            exact: true,
          },
        },
      },
    },
  },
  async getInitialURL() {
    // Check if app was opened from a deep link
    const url = await Linking.getInitialURL();

    if (url != null) {
      return url;
    }

    // Check if there is an initial firebase notification
    const message = await messaging().getInitialNotification();

    if (message?.data?.facebook) {
      canOpenUrl(message?.data?.facebook, message?.data?.link);
    } else {
      // Get deep link from data
      // if this is undefined, the app will open the default/home page
      return message?.data?.link;
    }
  },
  subscribe(listener) {
    const onReceiveURL = ({ url }: { url: string }) => listener(url);

    // Listen to incoming links from deep linking
    Linking.addEventListener('url', onReceiveURL);

    // Listen to firebase push notifications
    const unsubscribeNotification = messaging().onNotificationOpenedApp(
      (message) => {
        const url = message?.data?.link;
        const facebook = message?.data?.facebook;

        if (facebook) {
          canOpenUrl(facebook, url);
        } else if (url) {
          // Any custom logic to check whether the URL needs to be handled

          // Call the listener to let React Navigation handle the URL
          listener(url);
        }
      },
    );

    return () => {
      // Clean up the event listeners
      Linking.removeEventListener('url', onReceiveURL);
      unsubscribeNotification();
    };
  },
};
