import React from 'react';
import { Pressable } from 'react-native';
import { Tag, Text } from '@components';
import { BaseColor, useTheme } from '@config';

interface Props {
  leftText: string;
  title: string;
  rightText: string | number;
  onPress: () => void;
}
export default function EcommerceButton({
  leftText,
  rightText,
  title,
  onPress,
}: Props) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: colors.primary,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
      }}>
      <Text heavy style={{ color: BaseColor.whiteColor }}>
        {leftText}
      </Text>
      <Text title3 style={{ color: BaseColor.whiteColor }}>
        {title}
      </Text>
      <Tag rate>{rightText}</Tag>
    </Pressable>
  );
}
