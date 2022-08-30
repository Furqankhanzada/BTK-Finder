import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';

import { BaseColor, useTheme } from '@config';
import { Text, Icon } from '@components';
import * as Utils from '@utils';

interface props {
  style?: StyleProp<ViewStyle>;
  icon: any;
  title: string;
  subTitle?: string;
  onPress: any;
  image: object;
}

export default function CategoryFull(props: props) {
  const { colors } = useTheme();
  const { style, icon, title, onPress } = props;
  return (
    <TouchableOpacity
      style={[styles.contain, style]}
      onPress={onPress}
      activeOpacity={0.9}>
      <View style={styles.contentIcon}>
        <View
          style={[styles.iconCircle, { backgroundColor: colors.primaryLight }]}>
          <Icon name={icon} size={18} color={BaseColor.whiteColor} />
        </View>
        <View style={styles.subContainer}>
          <Text headline bold whiteColor>
            {title}
          </Text>
          <Text body2 bold whiteColor>
            Tap to view related items
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  contain: {
    flexDirection: 'row',
    height: Utils.scaleWithPixel(115),
    borderRadius: 8,
  },
  contentIcon: {
    position: 'absolute',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageLoadStyle: {
    flex: 1,
    borderRadius: 8,
  },
  imageLoadPlaceholder: {
    height: 50,
    width: 50,
  },
  imageLoadLoading: {
    size: 'large',
    color: '#68c9ef',
  },
  subContainer: {
    paddingLeft: 10,
  },
});
