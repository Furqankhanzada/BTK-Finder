import { LinkingOptions } from '@react-navigation/native';

import { RootStackParamList } from '../models/RootStackParamList';

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
};
