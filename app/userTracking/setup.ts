import analytics from '@react-native-firebase/analytics';
import humps from 'humps';
import SCREENS from './Screens';

type User = {
  userId: string;
  name: string;
  phone: string;
  email: String;
};

export function setUserProperties(data: User) {
  const { userId, name, phone, email } = humps.camelizeKeys(data);

  const userProperties = Object.assign(
    userId && { userId },
    name && { name },
    phone && { phone },
    email && { email },
  );

  try {
    analytics().setUserProperties(userProperties);
  } catch (err) {
    console.error(err);
  }
}

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
