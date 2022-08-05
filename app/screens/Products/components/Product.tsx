import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { Image, Text } from '@components';
import { useTheme, Images } from '@config';

interface Props {
  style: StyleProp<ViewStyle>;
  name: string;
  description: string;
  price: string;
  image: string;
  onPress: () => void;
}

export default function MenuItem(props: Props) {
  const { colors } = useTheme();
  const { style, name, description, price, image, onPress } = props;
  return (
    <TouchableOpacity
      style={[styles.container, { borderColor: colors.border }, style]}
      onPress={onPress}
      activeOpacity={0.9}>
      <Image
        source={image ? image : Images.imagePlaceholder}
        style={[styles.thumbnail]}
      />
      <View style={styles.content}>
        <Text caption2 numberOfLines={2} style={styles.textAlignCenter}>
          {name}
        </Text>
        {description ? (
          <Text
            numberOfLines={2}
            overline
            grayColor
            style={[styles.description, styles.textAlignCenter]}>
            {description}
          </Text>
        ) : null}
        <Text overline semibold>
          {price}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    // flexDirection: 'column',
    alignItems: 'center',
    width: 110,
    padding: 10,
    borderWidth: 1,
    borderLeftWidth: 0,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginBottom: 5,
  },
  content: {
    // flex: 1,
    alignItems: 'center',
  },
  textAlignCenter: {
    textAlign: 'center',
  },
  description: {
    paddingBottom: 5,
  },
});
