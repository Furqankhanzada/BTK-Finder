import { useEffect } from 'react';
import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';

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
        NavigationService.navigate('PlaceDetail', { id });
      }
    }, 1000);
  };
}
