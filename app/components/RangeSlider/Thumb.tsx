import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { BaseStyle, useTheme } from '@config';

const THUMB_RADIUS = 12;

const Thumb = () => {
  return <View style={styles.root} />;
};

const styles = StyleSheet.create({
  root: {
    width: THUMB_RADIUS * 2.1,
    height: THUMB_RADIUS * 2.1,
    borderRadius: THUMB_RADIUS,
    borderWidth: 4,
    borderColor: '#5DADE2',
    backgroundColor: '#ffffff',
  },
});

export default memo(Thumb);