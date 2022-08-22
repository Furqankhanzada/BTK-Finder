import { useCallback, useEffect } from 'react';
import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';
import Config from 'react-native-config';

import { getLastIndex } from '@utils';

import * as NavigationService from '../services/NavigationService';

export default function useDynamicLinks() {
  useEffect(() => {
    dynamicLinks().getInitialLink().then(onDynamicLinkOpen);
    const unsubscribe = dynamicLinks().onLink(onDynamicLinkOpen);
    return () => unsubscribe();
  });

  const onDynamicLinkOpen = (
    link: FirebaseDynamicLinksTypes.DynamicLink | null,
  ) => {
    if (link && link.url) {
      const id = getLastIndex(link.url);
      navigateToBusinessDetail(id);
    }
  };

  const navigateToBusinessDetail = (id: string) => {
    const interval = setInterval(() => {
      if (NavigationService.isReadyRef.current) {
        clearInterval(interval);
        NavigationService.navigate('BusinessDetailTabNavigator', { id });
      }
    }, 1000);
  };

  return useCallback(async (businessId) => {
    const fallbackUrl = `${Config.ADMIN_URL}/businesses/${businessId}?publicView=true`;

    return await dynamicLinks().buildShortLink({
      link: fallbackUrl,
      domainUriPrefix: Config.DYNAMIC_LINK_URL,
      android: {
        packageName: 'com.explore.btk',
        fallbackUrl,
      },
      ios: {
        bundleId: 'com.explore.btk',
        fallbackUrl,
      },
    });
  }, []);
}
