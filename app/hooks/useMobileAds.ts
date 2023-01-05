import mobileAds, {
  MaxAdContentRating,
  TestIds,
  useInterstitialAd,
} from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';
import { useCallback, useEffect } from 'react';

export let dashboardBannerUnitIdOne: string;
export let dashboardBannerUnitIdTwo: string;

let businessDetailInterstitialUnitIdOne: string;
let businessDetailInterstitialUnitIdTwo: string;

if (Platform.OS === 'ios') {
  dashboardBannerUnitIdOne = 'ca-app-pub-6507255964694411/7766075308';
  dashboardBannerUnitIdTwo = 'ca-app-pub-6507255964694411/5005848897';

  businessDetailInterstitialUnitIdOne =
    'ca-app-pub-6507255964694411/9670447241';
  businessDetailInterstitialUnitIdTwo =
    'ca-app-pub-6507255964694411/8937355043';
} else {
  dashboardBannerUnitIdOne = 'ca-app-pub-6507255964694411/5571216875';
  dashboardBannerUnitIdTwo = 'ca-app-pub-6507255964694411/1162505484';

  businessDetailInterstitialUnitIdOne =
    'ca-app-pub-6507255964694411/7433009170';
  businessDetailInterstitialUnitIdTwo =
    'ca-app-pub-6507255964694411/1686692629';
}
// During development use test IDs
if (__DEV__) {
  dashboardBannerUnitIdOne = TestIds.BANNER;
  dashboardBannerUnitIdTwo = TestIds.BANNER;

  businessDetailInterstitialUnitIdOne = TestIds.INTERSTITIAL;
  businessDetailInterstitialUnitIdTwo = TestIds.INTERSTITIAL;
}

export default function useMobileAds({
  interstitialOneCallback,
  interstitialTwoCallback,
}: {
  interstitialOneCallback: () => void;
  interstitialTwoCallback: () => void;
}) {
  const {
    isLoaded: isLoadedOne,
    isClosed: isClosedOne,
    load: loadOne,
    show: showOne,
  } = useInterstitialAd(businessDetailInterstitialUnitIdOne, {
    requestNonPersonalizedAdsOnly: true,
  });
  const {
    isLoaded: isLoadedTwo,
    isClosed: isClosedTwo,
    load: loadTwo,
    show: showTwo,
  } = useInterstitialAd(businessDetailInterstitialUnitIdTwo, {
    requestNonPersonalizedAdsOnly: true,
  });

  useEffect(() => {
    loadOne();
  }, [loadOne]);

  useEffect(() => {
    if (isClosedOne) {
      interstitialOneCallback();
    }
  }, [interstitialOneCallback, isClosedOne]);

  useEffect(() => {
    loadTwo();
  }, [loadTwo]);

  useEffect(() => {
    if (isClosedTwo) {
      interstitialTwoCallback();
    }
  }, [interstitialTwoCallback, isClosedTwo]);

  const onPressOne = useCallback(() => {
    if (isLoadedOne) {
      showOne();
    } else {
      interstitialOneCallback();
    }
  }, [interstitialOneCallback, isLoadedOne, showOne]);

  const onPressTwo = useCallback(() => {
    if (isLoadedTwo) {
      showTwo();
    } else {
      interstitialTwoCallback();
    }
  }, [interstitialTwoCallback, isLoadedTwo, showTwo]);

  return { onPressOne, onPressTwo };
}

export async function initMobileAds() {
  await mobileAds().setRequestConfiguration({
    // Update all future requests suitable for parental guidance
    maxAdContentRating: MaxAdContentRating.PG,
    // Indicates that you want your content treated as child-directed for purposes of COPPA.
    tagForChildDirectedTreatment: true,
    // Indicates that you want the ad request to be handled in a
    // manner suitable for users under the age of consent.
    tagForUnderAgeOfConsent: true,
    // An array of test device IDs to allow.
    testDeviceIdentifiers: ['EMULATOR'],
  });

  await mobileAds().initialize();
}
