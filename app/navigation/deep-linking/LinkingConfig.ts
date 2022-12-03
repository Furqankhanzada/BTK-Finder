import { LinkingOptions } from '@react-navigation/native';

// @ts-expect-error Legacy module
export const linkingConfig: LinkingOptions = {
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
          MainBottomTabNavigator: {
            path: 'main_bottom',
            exact: true,
            screens: {
              Profile: {
                path: 'profile',
                exact: true,
              },
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
