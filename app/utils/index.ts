import {
  Platform,
  Dimensions,
  Linking,
  PixelRatio,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Image } from 'react-native-image-crop-picker';
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { io } from 'socket.io-client';
import Config from 'react-native-config';

export const socket = io(`${Config.API_URL}`);

export const enableExperimental = () => {
  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
};

const scaleValue = PixelRatio.get() / 2;

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

export const navigateToLink = (
  notification: FirebaseMessagingTypes.RemoteMessage | null,
) => {
  if (notification && notification.data) {
    const { facebook, link, deeplink } = notification.data;
    if (facebook) {
      canOpenUrl(facebook, link);
    } else if (link || deeplink) {
      Linking.openURL(link || deeplink);
    }
  }
};

export const getLastIndex = (item: string): string => {
  const splitUrl = item.split('/');
  return splitUrl[splitUrl.length - 1];
};

// https://en.wikipedia.org/wiki/List_of_ISO_3166_country_codes#Current_ISO_3166_country_codes
// iTunes app look up expects Alpha 2, while react-native-store-front returns Alpha 3
export const iso3166Alpha3CountryCodeToAlpha2 = {
  AFG: 'AF',
  ALA: 'AX',
  ALB: 'AL',
  DZA: 'DZ',
  ASM: 'AS',
  AND: 'AD',
  AGO: 'AO',
  AIA: 'AI',
  ATA: 'AQ',
  ATG: 'AG',
  ARG: 'AR',
  ARM: 'AM',
  ABW: 'AW',
  AUS: 'AU',
  AUT: 'AT',
  AZE: 'AZ',
  BHS: 'BS',
  BHR: 'BH',
  BGD: 'BD',
  BRB: 'BB',
  BLR: 'BY',
  BEL: 'BE',
  BLZ: 'BZ',
  BEN: 'BJ',
  BMU: 'BM',
  BTN: 'BT',
  BOL: 'BO',
  BIH: 'BA',
  BWA: 'BW',
  BVT: 'BV',
  BRA: 'BR',
  VGB: 'VG',
  IOT: 'IO',
  BRN: 'BN',
  BGR: 'BG',
  BFA: 'BF',
  BDI: 'BI',
  KHM: 'KH',
  CMR: 'CM',
  CAN: 'CA',
  CPV: 'CV',
  CYM: 'KY',
  CAF: 'CF',
  TCD: 'TD',
  CHL: 'CL',
  CHN: 'CN',
  HKG: 'HK',
  MAC: 'MO',
  CXR: 'CX',
  CCK: 'CC',
  COL: 'CO',
  COM: 'KM',
  COG: 'CG',
  COD: 'CD',
  COK: 'CK',
  CRI: 'CR',
  CIV: 'CI',
  HRV: 'HR',
  CUB: 'CU',
  CYP: 'CY',
  CZE: 'CZ',
  DNK: 'DK',
  DJI: 'DJ',
  DMA: 'DM',
  DOM: 'DO',
  ECU: 'EC',
  EGY: 'EG',
  SLV: 'SV',
  GNQ: 'GQ',
  ERI: 'ER',
  EST: 'EE',
  ETH: 'ET',
  FLK: 'FK',
  FRO: 'FO',
  FJI: 'FJ',
  FIN: 'FI',
  FRA: 'FR',
  GUF: 'GF',
  PYF: 'PF',
  ATF: 'TF',
  GAB: 'GA',
  GMB: 'GM',
  GEO: 'GE',
  DEU: 'DE',
  GHA: 'GH',
  GIB: 'GI',
  GRC: 'GR',
  GRL: 'GL',
  GRD: 'GD',
  GLP: 'GP',
  GUM: 'GU',
  GTM: 'GT',
  GGY: 'GG',
  GIN: 'GN',
  GNB: 'GW',
  GUY: 'GY',
  HTI: 'HT',
  HMD: 'HM',
  VAT: 'VA',
  HND: 'HN',
  HUN: 'HU',
  ISL: 'IS',
  IND: 'IN',
  IDN: 'ID',
  IRN: 'IR',
  IRQ: 'IQ',
  IRL: 'IE',
  IMN: 'IM',
  ISR: 'IL',
  ITA: 'IT',
  JAM: 'JM',
  JPN: 'JP',
  JEY: 'JE',
  JOR: 'JO',
  KAZ: 'KZ',
  KEN: 'KE',
  KIR: 'KI',
  PRK: 'KP',
  KOR: 'KR',
  KWT: 'KW',
  KGZ: 'KG',
  LAO: 'LA',
  LVA: 'LV',
  LBN: 'LB',
  LSO: 'LS',
  LBR: 'LR',
  LBY: 'LY',
  LIE: 'LI',
  LTU: 'LT',
  LUX: 'LU',
  MKD: 'MK',
  MDG: 'MG',
  MWI: 'MW',
  MYS: 'MY',
  MDV: 'MV',
  MLI: 'ML',
  MLT: 'MT',
  MHL: 'MH',
  MTQ: 'MQ',
  MRT: 'MR',
  MUS: 'MU',
  MYT: 'YT',
  MEX: 'MX',
  FSM: 'FM',
  MDA: 'MD',
  MCO: 'MC',
  MNG: 'MN',
  MNE: 'ME',
  MSR: 'MS',
  MAR: 'MA',
  MOZ: 'MZ',
  MMR: 'MM',
  NAM: 'NA',
  NRU: 'NR',
  NPL: 'NP',
  NLD: 'NL',
  ANT: 'AN',
  NCL: 'NC',
  NZL: 'NZ',
  NIC: 'NI',
  NER: 'NE',
  NGA: 'NG',
  NIU: 'NU',
  NFK: 'NF',
  MNP: 'MP',
  NOR: 'NO',
  OMN: 'OM',
  PAK: 'PK',
  PLW: 'PW',
  PSE: 'PS',
  PAN: 'PA',
  PNG: 'PG',
  PRY: 'PY',
  PER: 'PE',
  PHL: 'PH',
  PCN: 'PN',
  POL: 'PL',
  PRT: 'PT',
  PRI: 'PR',
  QAT: 'QA',
  REU: 'RE',
  ROU: 'RO',
  RUS: 'RU',
  RWA: 'RW',
  BLM: 'BL',
  SHN: 'SH',
  KNA: 'KN',
  LCA: 'LC',
  MAF: 'MF',
  SPM: 'PM',
  VCT: 'VC',
  WSM: 'WS',
  SMR: 'SM',
  STP: 'ST',
  SAU: 'SA',
  SEN: 'SN',
  SRB: 'RS',
  SYC: 'SC',
  SLE: 'SL',
  SGP: 'SG',
  SVK: 'SK',
  SVN: 'SI',
  SLB: 'SB',
  SOM: 'SO',
  ZAF: 'ZA',
  SGS: 'GS',
  SSD: 'SS',
  ESP: 'ES',
  LKA: 'LK',
  SDN: 'SD',
  SUR: 'SR',
  SJM: 'SJ',
  SWZ: 'SZ',
  SWE: 'SE',
  CHE: 'CH',
  SYR: 'SY',
  TWN: 'TW',
  TJK: 'TJ',
  TZA: 'TZ',
  THA: 'TH',
  TLS: 'TL',
  TGO: 'TG',
  TKL: 'TK',
  TON: 'TO',
  TTO: 'TT',
  TUN: 'TN',
  TUR: 'TR',
  TKM: 'TM',
  TCA: 'TC',
  TUV: 'TV',
  UGA: 'UG',
  UKR: 'UA',
  ARE: 'AE',
  GBR: 'GB',
  USA: 'US',
  UMI: 'UM',
  URY: 'UY',
  UZB: 'UZ',
  VUT: 'VU',
  VEN: 'VE',
  VNM: 'VN',
  VIR: 'VI',
  WLF: 'WF',
  ESH: 'EH',
  YEM: 'YE',
  ZMB: 'ZM',
  ZWE: 'ZW',
  XKX: 'XK',
};

export type ISO3166Alpha3 = keyof typeof iso3166Alpha3CountryCodeToAlpha2;
