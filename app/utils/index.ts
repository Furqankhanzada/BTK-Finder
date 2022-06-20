import { Platform, Dimensions, Linking, PixelRatio } from 'react-native';
import Toast from 'react-native-toast-message';
import { Image } from 'react-native-image-crop-picker';
import PushNotification from 'react-native-push-notification';
import Config from 'react-native-config';

const scaleValue = PixelRatio.get() / 2;

export const createChannel = () => {
  PushNotification.createChannel(
    {
      channelId: Config.ANDROID_CHANNEL_ID, // (required)
      channelName: 'Special message', // (required)
      channelDescription: 'Notification for special message', // (optional) default: undefined.
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    (created) => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
  );
};

export const scaleWithPixel = (size: number, limitScale = 1.2) => {
  /* setting default upto 20% when resolution device upto 20% with defalt iPhone 7 */
  const value = scaleValue > limitScale ? limitScale : scaleValue;
  return size * value;
};

export const heightHeader = () => {
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const landscape = width > height;

  if (Platform.OS === 'android') {
    return 45;
  }
  if ('isPad' in Platform && Platform.isPad) {
    return 65;
  }
  switch (height) {
    case 375:
    case 414:
    case 812:
    case 896:
      return landscape ? 45 : 88;
    default:
      return landscape ? 45 : 65;
  }
};

export const scrollEnabled = (_: any, contentHeight: number) => {
  return contentHeight > Dimensions.get('window').height - heightHeader();
};

export const getWidthDevice = () => {
  return Dimensions.get('window').width;
};

export const handleError = (error: any) => {
  let title = 'Error';
  let description = error.message;

  if (!error.response) {
    description = error.message;
  } else if (error.response.data) {
    let {
      data: { error: e, message },
    } = error.response;
    title = e;
    description = typeof message === 'object' ? message.join('\n') : message;
  }
  Toast.show({
    type: 'error',
    topOffset: 55,
    text1: title || error, // error.response.data.error,
    text2: description, // error.response.data.message.join('\n'),
  });
};

export const uuid = () => {
  let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  return s4() + s4() + '-' + s4();
};

export const generateFileObject = (file: Image) => {
  const filename = file.path.replace(/^.*[\\/]/, '');
  return {
    uri:
      Platform.OS === 'android' ? file.path : file.path.replace('file://', ''),
    type: 'multipart/form-data',
    name: filename,
  };
};

export const canOpenFacebookPage = (id: string, url: string) => {
  Linking.canOpenURL('fb://page/' + id).then((supported) => {
    if (supported) {
      return Linking.openURL('fb://page/' + id);
    } else {
      return Linking.openURL(url);
    }
  });
};

export const canOpenUrl = (url: string, altUrl: string): void => {
  Linking.canOpenURL(url).then((supported) => {
    if (supported) {
      return Linking.openURL(url);
    } else {
      return Linking.openURL(altUrl);
    }
  });
};

export const getLastIndex = (item: string): string => {
  const splitUrl = item.split('/');
  return splitUrl[splitUrl.length - 1];
};
