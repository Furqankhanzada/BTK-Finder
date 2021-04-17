import {
  Platform,
  UIManager,
  LayoutAnimation,
  PixelRatio,
  Dimensions,
  I18nManager,
  Linking,
} from 'react-native';
import RNRestart from 'react-native-restart';
import Toast from 'react-native-toast-message';

const scaleValue = PixelRatio.get() / 2;

export const enableExperimental = () => {
  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
};

export const scaleWithPixel = (size, limitScale = 1.2) => {
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
  if (Platform.isPad) {
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

export const heightTabView = () => {
  const height = Dimensions.get('window').height;
  let size = height - heightHeader();
  switch (height) {
    case 375:
    case 414:
    case 812:
    case 896:
      size -= 30;
      break;
    default:
      break;
  }

  return size;
};

export const getWidthDevice = () => {
  return Dimensions.get('window').width;
};

export const getHeightDevice = () => {
  return Dimensions.get('window').height;
};

export const scrollEnabled = (contentWidth, contentHeight) => {
  return contentHeight > Dimensions.get('window').height - heightHeader();
};

export const languageFromCode = (code) => {
  switch (code) {
    case 'en':
      return 'English';
    case 'vi':
      return 'Vietnamese';
    case 'ar':
      return 'Arabic';
    case 'da':
      return 'Danish';
    case 'de':
      return 'German';
    case 'el':
      return 'Greek';
    case 'fr':
      return 'French';
    case 'he':
      return 'Hebrew';
    case 'id':
      return 'Indonesian';
    case 'ja':
      return 'Japanese';
    case 'ko':
      return 'Korean';
    case 'lo':
      return 'Lao';
    case 'nl':
      return 'Dutch';
    case 'zh':
      return 'Chinese';
    case 'fa':
      return 'Iran';
    case 'km':
      return 'Cambodian';
    default:
      return 'Unknown';
  }
};

export const isLanguageRTL = (code) => {
  switch (code) {
    case 'ar':
    case 'he':
      return true;
    default:
      return false;
  }
};

export const reloadLocale = (oldLanguage, newLanguage) => {
  const oldStyle = isLanguageRTL(oldLanguage);
  const newStyle = isLanguageRTL(newLanguage);
  if (oldStyle != newStyle) {
    I18nManager.forceRTL(newStyle);
    RNRestart.Restart();
  }
};

export const handleError = (error) => {
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
  //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
  // return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  return s4() + s4() + "-" + s4();
};

export const generateFileObject = (file) => {
  const filename = file.path.replace(/^.*[\\\/]/, '');
  return {
    uri:
        Platform.OS === 'android'
            ? file.path
            : file.path.replace('file://', ''),
    type: 'multipart/form-data',
    name: filename,
  };
};

export const canOpenFacebookPage = (id, url) => {
  Linking.canOpenURL('fb://page/' + id).then(supported => {
    if (supported) {
      return Linking.openURL('fb://page/' + id);
    } else {
      return Linking.openURL(url);
    }
  });
};
