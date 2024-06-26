import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
  StyleSheet,
} from 'react-native';
import { Icon, Image, Text } from '@components';
import { BaseColor, Images, useTheme } from '@config';

type Props = {
  style?: StyleProp<ViewStyle>;
  thumbStyle?: StyleProp<ViewStyle>;
  txtContentStyle?: StyleProp<TextStyle>;
  image?: string;
  txtLeftTitle: string;
  txtContent: string;
  txtSubContent?: string;
  txtRight?: string;
  iconRightName?: string;
  onPress: () => void;
  thumbIconName?: string | null;
  showPoint?: boolean;
};

export default function ListThumbCircle(props: Props) {
  const { colors } = useTheme();
  const {
    style,
    thumbStyle,
    image,
    txtLeftTitle,
    txtContent,
    txtContentStyle,
    txtSubContent,
    txtRight,
    iconRightName,
    onPress,
    thumbIconName,
    showPoint,
  } = props;
  return (
    <TouchableOpacity
      style={[styles.contain, { borderBottomColor: colors.border }, style]}
      onPress={onPress}
      activeOpacity={0.9}>
      {image ? (
        <Image source={image} style={[styles.thumb, thumbStyle]} />
      ) : thumbIconName ? (
        <View
          style={[
            styles.thumb,
            styles.icon,
            { backgroundColor: colors.primary },
            thumbStyle,
          ]}>
          <Icon name={thumbIconName} size={20} color={BaseColor.whiteColor} />
        </View>
      ) : (
        <Image
          source={Images.imagePlaceholder}
          style={[styles.thumb, thumbStyle]}
        />
      )}
      <View style={styles.content}>
        <View style={styles.left}>
          <Text headline semibold>
            {txtLeftTitle}
          </Text>
          <Text
            numberOfLines={2}
            footnote
            grayColor
            style={[styles.textContentStyle, txtContentStyle]}>
            {txtContent}
          </Text>
          {txtSubContent ? (
            <Text
              caption2
              grayColor
              numberOfLines={1}
              style={styles.textSubContent}>
              {txtSubContent}
            </Text>
          ) : null}
        </View>
        {txtRight || iconRightName ? (
          <View style={styles.right}>
            {txtRight ? (
              <Text caption2 grayColor numberOfLines={1}>
                {txtRight}
              </Text>
            ) : null}
            {iconRightName ? (
              <Icon
                name={iconRightName}
                size={15}
                color={colors.primary}
                solid
              />
            ) : null}
          </View>
        ) : null}
      </View>

      {showPoint ? (
        <View style={[styles.point, { backgroundColor: colors.primary }]} />
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  contain: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
  },
  point: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginLeft: 7,
    alignSelf: 'center',
  },
  thumb: {
    width: 48,
    height: 48,
    marginRight: 10,
    borderRadius: 24,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  textContentStyle: {
    paddingTop: 5,
  },
  textSubContent: {
    marginTop: 5,
  },
  left: {
    flex: 7.5,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  right: {
    flex: 2.5,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
