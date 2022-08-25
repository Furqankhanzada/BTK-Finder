import React from 'react';
import { StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

export default function Image(props) {
  let { style, resizeMode, source, ...rest } = props;
  source =
    typeof source === 'string' && source.indexOf('http') !== -1
      ? { uri: source }
      : source;
  let resize = FastImage.resizeMode.cover;
  switch (resizeMode) {
    case 'contain':
      resize = FastImage.resizeMode.contain;
      break;
    case 'stretch':
      resize = FastImage.resizeMode.stretch;
      break;
    case 'center':
      resize = FastImage.resizeMode.center;
      break;
    default:
      break;
  }
  return (
    <FastImage
      source={source}
      style={StyleSheet.flatten([style && style])}
      {...rest}
      resizeMode={resize}
    />
  );
}

Image.defaultProps = {
  style: {},
  resizeMode: 'cover',
};
