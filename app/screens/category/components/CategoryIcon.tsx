import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { BaseColor, useTheme } from '@config';
import { Text, Icon } from '@components';

export interface CategoryComponents {
  style?: StyleProp<ViewStyle>;
  title: string;
  onPress: () => void;
  icon: string;
}

export default function CategoryIcon(props: CategoryComponents) {
  const { colors } = useTheme();
  const { style, icon, title, onPress } = props;
  return (
    <TouchableOpacity
      style={[styles.contain, style]}
      onPress={onPress}
      activeOpacity={0.9}>
      <View
        style={[styles.iconContent, { backgroundColor: colors.primaryLight }]}>
        <Icon name={icon} size={32} color={BaseColor.whiteColor} solid />
      </View>
      <View style={styles.subContainer}>
        <Text headline semibold>
          {title}
        </Text>
        <Text footnote semibold grayColor style={styles.subContainerText}>
          Tap to view related items
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  contain: {
    flexDirection: 'row',
  },
  iconContent: {
    width: 60,
    height: 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subContainer: {
    padding: 10,
  },
  subContainerText: {
    marginTop: 5,
  },
});
