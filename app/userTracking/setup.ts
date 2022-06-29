import analytics from '@react-native-firebase/analytics';
import SCREENS from './Screens';

export function trackScreenView(screenName: string) {
  SCREENS[screenName] ? trackScreen(SCREENS[screenName]) : false;
}

const trackScreen = (trackingObject: any) => {
  analytics().logScreenView({
    screen_name: trackingObject.ATTRIBUTES.screenName,
  });
};

export function trackEvent(event: any, eventParams?: any) {
  const eventDate = new Date();
  const formattedDate = eventDate.toISOString().toString();

  const mergedAttributes = {
    ...event.GENERIC_ATTRIBUTES,
    ...(eventParams && eventParams),
    timestamp: formattedDate,
  };

  analytics().logEvent(event.TRACKING_KEY, mergedAttributes);
}
