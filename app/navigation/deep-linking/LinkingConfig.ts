import { LinkingOptions } from '@react-navigation/native';
import { Linking } from 'react-native';
import messaging from '@react-native-firebase/messaging';

import { RootStackParamList } from '../models/RootStackParamList';
import { navigateToLink } from '@utils';

export const linkingConfig: LinkingOptions<RootStackParamList> = {
  prefixes: ['explorebtk://', 'https://explorebtk.com'],
  config: {
    screens: {
      Main: {
        path: 'app',
        initialRouteName: 'MainBottomTabNavigator',
        screens: {
          MainBottomTabNavigator: {
            screens: {
              DashboardStack: {
                screens: {
                  NotificationStack: {
                    screens: {
                      Notification: {
                        path: 'notifications',
                        exact: true,
                      },
                      NotificationDetail: {
                        path: 'notifications/:id',
                        exact: true,
                      },
                    },
                  },
                },
              },
              SettingsStack: {
                screens: {
                  ContactUs: {
                    path: 'contact-us',
                    exact: true,
                  },
                  AboutUs: {
                    path: 'about-us',
                    exact: true,
                  },
                  MyMembershipsStack: {
                    screens: {
                      MyMemberships: {
                        path: 'my-memberships',
                        exact: true,
                      },
                      Invoices: {
                        path: 'invoices/:businessId',
                        exact: true,
                      },
                    },
                  },
                  MyBusinessesStack: {
                    screens: {
                      MyBusinesses: {
                        path: 'my-businesses',
                        exact: true,
                      },
                    },
                  },
                },
              },
            },
          },
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

    if (!message?.data?.deeplink) {
      navigateToLink(message);
      return '';
    }
    // Get deep link from data
    // if this is undefined, the app will open the default/home page
    return message?.data?.deeplink;
  },
  subscribe(listener) {
    const onReceiveURL = ({ url }: { url: string }) => listener(url);

    // Listen to incoming links from deep linking
    const subscription = Linking.addEventListener('url', onReceiveURL);

    // Listen to firebase push notifications
    const unsubscribeNotification = messaging().onNotificationOpenedApp(
      (message) => {
        const deeplink = message?.data?.deeplink;

        if (deeplink) {
          // Call the listener to let React Navigation handle the URL
          listener(deeplink);
        }
      },
    );

    return () => {
      // Clean up the event listeners
      subscription.remove();
      unsubscribeNotification();
    };
  },
};
