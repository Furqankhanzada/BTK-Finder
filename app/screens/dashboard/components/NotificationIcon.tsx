import { Icon, Text } from '@components';
import { BaseColor, useTheme } from '@config';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = {
  count: number;
};

export default function NotificationIcon({ count }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.iconContainer}>
      <Icon name="bell" size={19} color={colors.primaryDark} solid />
      {count > 0 ? (
        <View
          style={[styles.unreadCount, { backgroundColor: BaseColor.redColor }]}>
          <Text
            bold
            style={[styles.unreadCountText, { color: BaseColor.whiteColor }]}>
            {count}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 20,
    height: 20,
  },
  unreadCount: {
    position: 'absolute',
    right: -2,
    top: -6,
    width: 17,
    height: 17,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCountText: {
    fontSize: 12,
  },
});
