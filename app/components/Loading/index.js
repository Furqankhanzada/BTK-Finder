import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { BaseColor, useTheme } from '@config';
import PropTypes from 'prop-types';
import styles from './styles';

export default function Loading({ loading, style }) {
  const { colors } = useTheme();
  if (!loading) return null;
  return (
    <View
      style={[styles.container, { backgroundColor: colors.background }, style]}>
      <ActivityIndicator size="large" color={BaseColor.blueColor} style={{}} />
    </View>
  );
}

Loading.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  loading: PropTypes.bool,
};

Loading.defaultProps = {
  style: {},
  loading: false,
};
