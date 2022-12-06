import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { BaseColor, useTheme } from '@config';
import { Text } from '@components';
import styles from './styles';

export default function Button(props) {
  const { colors } = useTheme();
  const {
    style,
    styleText,
    icon,
    outline,
    full,
    round,
    loading,
    children,
    destructive,
    ...rest
  } = props;

  return (
    <TouchableOpacity
      {...rest}
      style={StyleSheet.flatten([
        [
          styles.default,
          {
            backgroundColor: destructive ? BaseColor.redColor : colors.primary,
          },
        ],
        outline && [
          styles.outline,
          { backgroundColor: colors.card, borderColor: colors.primary },
        ],
        full && styles.full,
        round && styles.round,
        style,
      ])}
      activeOpacity={0.9}>
      {icon ? icon : null}
      {children && (
        <Text
          style={StyleSheet.flatten([
            styles.textDefault,
            outline && { color: colors.primary },
            styleText,
          ])}
          numberOfLines={1}>
          {children}
        </Text>
      )}
      {loading ? (
        <ActivityIndicator
          size="small"
          color={outline ? colors.primary : BaseColor.whiteColor}
          style={{ paddingLeft: 5 }}
        />
      ) : null}
    </TouchableOpacity>
  );
}

Button.defaultProps = {
  style: {},
  icon: null,
  outline: false,
  full: false,
  round: false,
  loading: false,
};
